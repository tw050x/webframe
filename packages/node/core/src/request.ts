import { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import { parseRequestUrl } from "./http-method.js";

/**
 * The largest body read by default, 1 MiB. Longer bodies read as null.
 */
export const DEFAULT_BODY_LIMIT = 1024 * 1024;

export type ReadBodyOptions = {
  /** The most bytes to read; a longer body reads as null. */
  limit?: number;
}

/**
 * The incoming request, with helpers for reading its body, URL parameters and query.
 */
export default class ContextualIncomingMessage extends IncomingMessage {

  constructor(socket: Socket) {
    super(socket);
  }

  /** The body, once read: it can only be read from the stream once. */
  private body?: Promise<string | null>;

  /**
   * Reads the body as text, at most `limit` bytes; null if it's longer or the stream fails.
   * Reading it again gives the same result.
   */
  readBody(options: ReadBodyOptions = {}): Promise<string | null> {
    const limit = options.limit ?? DEFAULT_BODY_LIMIT;
    this.body ??= new Promise((resolve) => {
      const chunks: Buffer[] = [];
      let length = 0;
      this.on('data', (chunk: Buffer) => {
        length += chunk.length;
        if (length > limit) {
          resolve(null);
          this.destroy();
          return;
        }
        chunks.push(chunk);
      });
      this.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      this.on('error', () => resolve(null));
      this.on('close', () => resolve(null));
    });
    return this.body;
  }

  /**
   * Reads a form body (`application/x-www-form-urlencoded`) as an object of strings.
   *
   * @example
   * // body 'city=New+York&country=USA'
   * await incomingMessage.useFormDataBody(); // { city: 'New York', country: 'USA' }
   * // empty body
   * await incomingMessage.useFormDataBody(); // {}
   * // body over the limit
   * await incomingMessage.useFormDataBody(); // null
   */
  async useFormDataBody(options?: ReadBodyOptions): Promise<Record<string, string> | null> {
    const body = await this.readBody(options);
    if (body === null) return null;
    return Object.fromEntries(new URLSearchParams(body));
  }

  /**
   * Reads a JSON body; null if it's empty, isn't JSON or is over the limit.
   *
   * @example
   * // body '{"name":"John","age":30}'
   * await incomingMessage.useJSONBody(); // { name: 'John', age: 30 }
   * // body 'not json'
   * await incomingMessage.useJSONBody(); // null
   */
  async useJSONBody(options?: ReadBodyOptions): Promise<unknown> {
    const body = await this.readBody(options);
    if (body === null) return null;
    try {
      return JSON.parse(body);
    }
    catch {
      return null;
    }
  }

  /**
   * The URL's parameters for a route pattern, such as `/users/:id`; {} if the URL doesn't match it.
   * Trailing slashes and the query are ignored, and values are decoded.
   *
   * @example
   * // URL '/orders/456/items/789?ref=abc'
   * incomingMessage.useUrlParams('/orders/:orderId/items/:itemId'); // { orderId: '456', itemId: '789' }
   * incomingMessage.useUrlParams('/orders/:orderId'); // {}
   */
  useUrlParams(pattern: string): Record<string, string> {
    if (this.url === undefined || this.url === '') {
      return {};
    }

    const pathname = parseRequestUrl(this.url).pathname;
    const patternSegments = pattern.split('/').filter(segment => segment !== '');
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    if (patternSegments.length !== pathSegments.length) {
      return {};
    }

    const params: Record<string, string> = {};
    for (const [i, patternSegment] of patternSegments.entries()) {
      const pathSegment = pathSegments[i]!;
      if (patternSegment.startsWith(':')) {
        params[patternSegment.slice(1)] = decode(pathSegment);
      }
      else if (patternSegment !== pathSegment) {
        return {};
      }
    }
    return params;
  }

  /**
   * The URL's query, as an object of strings (the last value of a repeated key).
   *
   * @example
   * // URL '/search?query=hello&page=2'
   * incomingMessage.useUrlQuery(); // { query: 'hello', page: '2' }
   */
  useUrlQuery(): Record<string, string | undefined> {
    const url = parseRequestUrl(this.url);
    return Object.fromEntries(url.searchParams);
  }
}

/** Decodes a URL segment, leaving it as it is if it isn't valid. */
const decode = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  }
  catch {
    return segment;
  }
}
