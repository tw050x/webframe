import { readFileSync, writeFileSync } from "node:fs";

export type HealthStatus = 'healthy' | 'unhealthy';

export type HealthcheckOptions = {
  /** The file the status is written to, for the container's healthcheck to read. */
  filePath: string;
  /** How often to write it, in milliseconds. */
  checkInterval: number;
}

export type Healthcheck = {
  /** The status in the file. Throws, and marks the service unhealthy, if the file holds anything else. */
  read(): HealthStatus;
  /** Marks the service unhealthy for good: an error it can't recover from. */
  error(): void;
  /** Stops writing the status. */
  stop(): void;
}

/**
 * Writes the service's health to a file every so often, `healthy` until `error()` is called,
 * for a container healthcheck such as `test: ["CMD", "grep", "-q", "^healthy$", "/tmp/health"]`.
 * Workers without an HTTP server use it in place of `GET /healthcheck`.
 */
export function defineHealthcheck(options: HealthcheckOptions): Healthcheck {
  let unrecoverable = false;

  const write = () => {
    writeFileSync(options.filePath, unrecoverable ? 'unhealthy' : 'healthy', 'utf-8');
  };

  const error = () => {
    unrecoverable = true;
    clearInterval(interval);
    write();
  };

  const read = (): HealthStatus => {
    const content = readFileSync(options.filePath, 'utf-8');
    if (content === 'healthy' || content === 'unhealthy') {
      return content;
    }
    error();
    throw new Error(`Invalid healthcheck file content: ${content}`);
  };

  const interval = setInterval(write, options.checkInterval);
  interval.unref();
  write();

  return Object.freeze({ read, error, stop: () => clearInterval(interval) });
}
