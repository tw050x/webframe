export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'] as const;

export type HttpMethod = typeof httpMethods[number];

/**
 * Whether a value is an HTTP method, in capitals.
 */
export const isHttpMethod = (value: unknown): value is HttpMethod => {
  return typeof value === 'string' && (httpMethods as readonly string[]).includes(value);
}

/**
 * Whether a value is an array of HTTP methods, in capitals.
 */
export const isArrayOfHttpMethods = (value: unknown): value is readonly HttpMethod[] => {
  return Array.isArray(value) && value.every(isHttpMethod);
}

/**
 * Whether a value is one of the methods given, narrowing it to them.
 */
export const isAllowedMethod = <T extends readonly HttpMethod[]>(value: string | undefined, allowedMethods: T): value is T[number] => {
  return value !== undefined && (allowedMethods as readonly string[]).includes(value);
}

/**
 * Parses a request's target. A path starting `//` is a path, not another host, as `new URL`
 * would read it.
 */
export const parseRequestUrl = (target: string | undefined): URL => {
  const url = target || '/';
  return url.startsWith('/') ? new URL(`http://localhost${url}`) : new URL(url, 'http://localhost');
}
