/**
 * What webframe logs through. A winston logger (`@webframe/logger`) fits it, and so does `console`.
 */
export interface Logger {
  debug(message: unknown, ...meta: unknown[]): unknown;
  info(message: unknown, ...meta: unknown[]): unknown;
  warn(message: unknown, ...meta: unknown[]): unknown;
  error(message: unknown, ...meta: unknown[]): unknown;
}

/**
 * The logger used when a server isn't given one: the console, without debug lines.
 */
export const defaultLogger: Logger = {
  debug: () => {},
  info: (message, ...meta) => console.info(message, ...meta),
  warn: (message, ...meta) => console.warn(message, ...meta),
  error: (message, ...meta) => console.error(message, ...meta),
};

/**
 * A logger that drops everything, for tests.
 */
export const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
