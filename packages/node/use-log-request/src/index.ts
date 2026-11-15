import type { Logger, Middleware } from "@webframe/core";

export type UseLogRequestOptions = {
  /** The level to log at; debug by default. */
  level?: keyof Logger;
}

/**
 * Logs each request's method and URL to the server's logger.
 */
export const useLogRequest = (options: UseLogRequestOptions = {}): Middleware => {
  const level = options.level ?? 'debug';
  return async ({ incomingMessage, logger }) => {
    logger[level](`${incomingMessage.method?.toUpperCase() || 'UNKNOWN METHOD'} ${incomingMessage.url}`);
  };
}
