import { createServer as createHttpServer, type Server as HttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { readFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { default as ContextualIncomingMessage } from "./request.js";
import { default as ContextualServerResponse } from "./response.js";
import { defaultLogger, type Logger } from "./logger.js";
import { parseRequestUrl } from "./http-method.js";
import type { RouteHandler, ServiceRequestContext } from "./types.js";

/**
 * Routes by `"METHOD /path"`, such as `"GET /users/:id"`. A `:name` segment matches any one
 * segment. Two keys are special: `"ERROR 404"` handles what matches nothing, and
 * `"SYSTEM /healthcheck"` answers `GET /healthcheck`; both have defaults.
 */
export type Routes = Record<string, RouteHandler>;

export type ServerOptions = {
  port: number;
  /** The address to listen on; Node's default (every address) if left out. */
  host?: string;
  routes: Routes;
  /** Where the server and its middleware log; the console without debug lines by default. */
  logger?: Logger;
  /** Serve HTTPS with this certificate and key; plain HTTP without it. */
  tls?: {
    certPath: string;
    keyPath: string;
    /** Ask clients for a certificate signed by one of these CAs (mutual TLS). */
    mutual?: {
      caPaths: string[];
      requestCert?: boolean;
      rejectUnauthorized?: boolean;
    };
  };
}

export type Server = {
  /** Starts listening; resolves once it is. */
  listen(callback?: () => void): Promise<void>;
  /** Stops listening; resolves once open connections have finished. */
  close(callback?: () => void): Promise<void>;
  /** The address it's listening on, once it is. */
  address(): AddressInfo | null;
  on: HttpServer<typeof ContextualIncomingMessage, typeof ContextualServerResponse>['on'];
}

/**
 * Defines a server for the routes given.
 *
 * @example
 * const server = defineServer({
 *   port: 3000,
 *   routes: {
 *     'GET /users/:id': defineMiddleware([useLogRequest(), showUser]),
 *   },
 * });
 * await server.listen();
 */
export default function defineServer(options: ServerOptions): Server {
  const logger = options.logger ?? defaultLogger;
  const routes = new Map<string, RouteHandler>();

  routes.set('ERROR 404', (context) => {
    context.logger.info(`Not Found: ${context.incomingMessage.method} ${context.incomingMessage.url}`);
    context.serverResponse.sendNotFoundTextResponse();
  });

  routes.set('SYSTEM /healthcheck', (context) => {
    context.serverResponse.sendOKTextResponse('Healthy');
  });

  for (const [pattern, route] of Object.entries(options.routes)) {
    const [method = '', path = ''] = pattern.trim().split(/\s+/);
    logger.debug(`- ${method.toUpperCase().padEnd(8)} ${path}`);
    routes.set(`${method.toUpperCase()} ${path}`, route);
  }

  const serverOptions = {
    IncomingMessage: ContextualIncomingMessage,
    ServerResponse: ContextualServerResponse,
  };

  type ContextualServer = HttpServer<typeof ContextualIncomingMessage, typeof ContextualServerResponse>;
  const server: ContextualServer = options.tls
    ? createHttpsServer({
      ...serverOptions,
      cert: readFileSync(options.tls.certPath),
      key: readFileSync(options.tls.keyPath),
      ...(options.tls.mutual
        ? {
          ca: options.tls.mutual.caPaths.map((path) => readFileSync(path)),
          requestCert: options.tls.mutual.requestCert ?? true,
          rejectUnauthorized: options.tls.mutual.rejectUnauthorized ?? true,
        }
        : {}
      ),
    })
    : createHttpServer(serverOptions);

  server.on('request', createRequestHandler({ routes, logger }));

  return Object.freeze({
    listen: (callback?: () => void) => new Promise<void>((resolve) => {
      server.listen(options.port, options.host, () => {
        callback?.();
        resolve();
      });
    }),
    close: (callback?: () => void) => new Promise<void>((resolve, reject) => {
      server.close((error) => {
        callback?.();
        if (error) reject(error);
        else resolve();
      });
    }),
    address: () => server.address() as AddressInfo | null,
    on: server.on.bind(server) as Server['on'],
  });
}

export type RequestHandlerOptions = {
  routes: Map<string, RouteHandler>;
  logger: Logger;
}

/**
 * Makes the server's request handler: matches each request to a route and runs it.
 *
 * An exact match wins; failing that, the pattern with the most segments whose `:name` segments
 * fill in to the path. A path ending in a slash (other than `/`) is redirected to the same path
 * without it.
 */
export const createRequestHandler = (options: RequestHandlerOptions) => (incomingMessage: ContextualIncomingMessage, serverResponse: ContextualServerResponse): void => {
  const method = incomingMessage.method?.toUpperCase();
  const rawUrl = incomingMessage.url || '';
  const url = parseRequestUrl(rawUrl);
  const urlPath = url.pathname;

  const context: ServiceRequestContext = {
    incomingMessage,
    serverResponse,
    logger: options.logger,
  };

  const run = (routeKey: string) => {
    const route = options.routes.get(routeKey)!;
    Promise.resolve()
      .then(() => route(context))
      .then(() => {
        if (serverResponse.sendingOrSent === false) {
          options.logger.error(`No response sent for ${method} ${urlPath}; sending 500 Internal Server Error.`);
          serverResponse.sendInternalServerErrorTextResponse();
        }
      })
      .catch((error) => {
        options.logger.error(error);
        if (serverResponse.sendingOrSent === false) serverResponse.sendInternalServerErrorTextResponse();
      });
  };

  if (method === 'GET' && urlPath === '/healthcheck') {
    return run('SYSTEM /healthcheck');
  }

  if (urlPath !== '/' && urlPath.endsWith('/')) {
    // one leading slash only: '//host' would be a redirect to another site
    const path = '/' + urlPath.replace(/^\/+|\/+$/g, '');
    serverResponse.writeHead(301, { 'Location': `${path}${url.search}` });
    return void serverResponse.end();
  }

  const exact = `${method} ${urlPath}`;
  if (options.routes.has(exact)) {
    return run(exact);
  }

  const pathSegments = urlPath.split('/');
  const candidates = Array.from(options.routes.keys())
    .filter((key) => key.startsWith(`${method} `) && key.includes('/:'))
    .sort((a, b) => segmentCount(b) - segmentCount(a));

  for (const key of candidates) {
    if (matches(key.slice(key.indexOf(' ') + 1), pathSegments)) {
      return run(key);
    }
  }

  return run('ERROR 404');
}

/** Whether a route's path, with `:name` segments, matches a path's segments. */
const matches = (pattern: string, pathSegments: string[]) => {
  const patternSegments = pattern.split('/');
  if (patternSegments.length !== pathSegments.length) return false;
  return patternSegments.every((segment, i) =>
    segment.startsWith(':') ? pathSegments[i] !== '' : segment === pathSegments[i]
  );
}

/** The number of segments in a route key's path. */
const segmentCount = (routeKey: string) => {
  const space = routeKey.indexOf(' ');
  return routeKey.slice(space + 1).split('/').filter(Boolean).length;
}
