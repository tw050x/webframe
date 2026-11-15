import { isArrayOfHttpMethods, isHttpMethod, type HttpMethod, type Middleware } from "@webframe/core";

/** The allowed origins: their hosts (`app.example.com`, `localhost:3000`), or `'*'` for any. */
export type AllowedOrigins = readonly string[] | '*';

export type UseCorsHeadersOptions = {
  /**
   * Origins allowed, by host. A function is called for each request, for origins read from
   * config (`() => configs.read('cors.allowed-origins').split(',')`).
   */
  allowedOrigins: AllowedOrigins | (() => AllowedOrigins | string);
  allowedMethods: readonly HttpMethod[] | '*';
  /** Headers a preflight may ask for: an array, a comma-separated list, or `'*'` (the default). */
  allowedHeaders?: readonly string[] | string;
}

/**
 * Whether an `Origin` header's host is one of those allowed. A missing or malformed origin isn't.
 */
export const isAllowedOrigin = (origin: string | undefined, allowedOrigins: readonly string[]): origin is string => {
  if (origin === undefined) return false;
  try {
    return allowedOrigins.includes(new URL(origin).host);
  }
  catch {
    return false;
  }
}

/**
 * Whether every header in an `Access-Control-Request-Headers` list is allowed, ignoring case.
 */
export const isAllowedHeaders = (headers: string | undefined, allowedHeaders: readonly string[]): headers is string => {
  if (headers === undefined) return false;
  const allowed = allowedHeaders.map((header) => header.toLowerCase());
  return headers.split(',').every((header) => allowed.includes(header.trim().toLowerCase()));
}

const parseList = (value: readonly string[] | string) =>
  (typeof value === 'string' ? value.split(',') : value).map((item) => item.trim()).filter(Boolean);

/**
 * Sets the CORS headers for the request's origin. It doesn't answer preflight requests itself:
 * give the route an `OPTIONS` pattern that sends 204 after it.
 *
 * @example
 * defineMiddleware([
 *   useCorsHeaders({ allowedOrigins: ['app.example.com'], allowedMethods: ['GET', 'POST'] }),
 *   async ({ serverResponse }) => serverResponse.sendNoContentResponse(),
 * ]);
 */
export const useCorsHeaders = (options: UseCorsHeadersOptions): Middleware => {
  const allowedHeaders = options.allowedHeaders === undefined || options.allowedHeaders === '*'
    ? '*'
    : parseList(options.allowedHeaders).map((header) => header.toLowerCase());

  const allowedMethods = options.allowedMethods === '*'
    ? '*'
    : options.allowedMethods.map((method) => method.trim().toUpperCase());
  if (allowedMethods !== '*' && isArrayOfHttpMethods(allowedMethods) === false) {
    throw new TypeError(`Invalid allowedMethods: ${allowedMethods.filter((method) => !isHttpMethod(method)).join(', ')}`);
  }

  const originsNow = (): AllowedOrigins => {
    const origins = typeof options.allowedOrigins === 'function' ? options.allowedOrigins() : options.allowedOrigins;
    if (origins === '*') return '*';
    return parseList(origins);
  };

  return async ({ incomingMessage, serverResponse }) => {
    const allowedOrigins = originsNow();
    const origin = incomingMessage.headers.origin;

    if (allowedOrigins === '*') {
      serverResponse.setHeader('Access-Control-Allow-Origin', '*');
    }
    else {
      // the header depends on the request's origin, so caches must keep them apart
      serverResponse.appendHeader('Vary', 'Origin');
      if (isAllowedOrigin(origin, allowedOrigins)) {
        serverResponse.setHeader('Access-Control-Allow-Origin', origin);
      }
    }

    serverResponse.setHeader('Access-Control-Allow-Methods', allowedMethods === '*' ? '*' : allowedMethods.join(', '));

    const isPreflight = incomingMessage.method === 'OPTIONS' && incomingMessage.headers['access-control-request-method'] !== undefined;
    if (isPreflight) {
      serverResponse.setHeader('Access-Control-Allow-Headers', allowedHeaders === '*' ? '*' : allowedHeaders.join(', '));
    }
  };
}
