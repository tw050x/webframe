import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

/** How long a value read is kept before reading its file again: 5 minutes. */
export const DEFAULT_TTL = 5 * 60 * 1000;

export type FileStoreOptions = {
  /** The directory holding a file per key, resolved from the working directory. */
  directory: string;
  /** How long a value is cached, in milliseconds; 0 reads the file every time. */
  ttl?: number;
}

export type FileStore = {
  /** Whether the key has a file. */
  exists(key: string): boolean;
  /** The key's value: its file's contents, trimmed. Throws if it has none. */
  read(key: string): string;
  /** The key's value, or the fallback if it has no file. */
  readOr<T>(key: string, fallback: T): string | T;
  /** Forgets cached values, so the next reads read the files. */
  clear(): void;
}

/**
 * Reads values from a directory with a file for each key, as Docker and Kubernetes mount configs
 * and secrets. Keys are file names, such as `logs.level` or `cors.*.allowed-origins`.
 *
 * @example
 * const configs = defineFileStore({ directory: '.configs' });
 * const secrets = defineFileStore({ directory: '/run/secrets' });
 * configs.read('logs.level'); // 'debug'
 */
export function defineFileStore(options: FileStoreOptions): FileStore {
  const directory = resolve(options.directory);
  const ttl = options.ttl ?? DEFAULT_TTL;
  const cache = new Map<string, { value: string; timestamp: number }>();

  const pathOf = (key: string) => {
    const path = resolve(directory, key);
    const inside = relative(directory, path);
    if (key === '' || inside === '' || inside.startsWith('..') || isAbsolute(inside)) {
      throw new Error(`Invalid key: ${key}`);
    }
    return path;
  };

  const exists = (key: string) => existsSync(pathOf(key));

  const read = (key: string) => {
    const path = pathOf(key);
    const cached = cache.get(path);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }
    if (existsSync(path) === false) {
      throw new Error(`File not found: ${key}`);
    }
    const value = readFileSync(path, 'utf-8').trim();
    cache.set(path, { value, timestamp: Date.now() });
    return value;
  };

  const readOr = <T>(key: string, fallback: T) => exists(key) ? read(key) : fallback;

  return Object.freeze({ exists, read, readOr, clear: () => cache.clear() });
}
