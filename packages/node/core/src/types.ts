import type ContextualIncomingMessage from "./request.js";
import type ContextualServerResponse from "./response.js";
import type { Logger } from "./logger.js";

/**
 * Makes every property optional, all the way down.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * The properties OutputContext adds to InputContext, including those added inside nested objects.
 */
export type NewPropertiesOnly<InputContext, OutputContext> = {
  [K in keyof OutputContext as K extends keyof InputContext
    ? InputContext[K] extends object
      ? OutputContext[K] extends object
        ? K
        : never
      : never
    : K
  ]?: K extends keyof InputContext
    ? InputContext[K] extends object
      ? OutputContext[K] extends object
        ? NewPropertiesOnly<InputContext[K], OutputContext[K]>
        : never
      : never
    : OutputContext[K];
};

/**
 * What every request's middleware is given: the request, the response and the server's logger.
 * Each middleware can add to it, for the ones after it.
 */
export type ServiceRequestContext = {
  incomingMessage: ContextualIncomingMessage;
  serverResponse: ContextualServerResponse;
  logger: Logger;
}

/**
 * Handles a request: what a route is, usually made with `defineMiddleware`.
 */
export type RouteHandler = (context: ServiceRequestContext) => void | Promise<void>;
