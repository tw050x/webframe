import { resolve } from "node:path";
import { createLogger as createWinstonLogger, format, transports, type Logger } from "winston";

export type { Logger };

export type LoggerOptions = {
  /** The lowest level logged: error, warn, info, debug… */
  level?: string;
  /** Where to write `combined.log` and `error.log`, as JSON lines; no files if left out. */
  directory?: string;
  /** Also log readable lines to the console; by default when NODE_ENV isn't production. */
  console?: boolean;
}

/**
 * A winston logger for a webframe service, to pass to `defineServer`.
 *
 * @example
 * const logger = createLogger({ level: configs.read('logs.level'), directory: configs.read('logs.directory') });
 * defineServer({ port, routes, logger });
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const logger = createWinstonLogger({
    level: options.level ?? 'info',
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.json(),
    ),
    transports: options.directory === undefined ? [] : [
      new transports.File({ filename: resolve(options.directory, 'combined.log') }),
      new transports.File({ filename: resolve(options.directory, 'error.log'), level: 'error' }),
    ],
  });

  if (options.console ?? process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.printf(({ level, message, timestamp, stack }) => {
          const text = stack ?? message;
          return level === 'debug' ? `${level}: ${text}` : `${level}: ${text} ${timestamp}`;
        }),
      ),
    }));
  }

  // winston warns when it has nowhere to write
  if (logger.transports.length === 0) {
    logger.silent = true;
  }

  return logger;
}
