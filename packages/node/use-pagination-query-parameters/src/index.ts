import { parseRequestUrl, type Middleware, type ServiceRequestContext } from "@webframe/core";

export type UsePaginationQueryParametersOptions = {
  /** The page shown when the URL doesn't say, counting from 0. */
  defaultPageIndex: number;
  /** How many to a page when the URL doesn't say. */
  defaultPageSize: number;
  /** The largest page size a URL may ask for; no limit if left out. */
  maxPageSize?: number;
  /** The query's names for the page index and size; `pi` and `ps` by default. */
  names?: { pageIndex?: string; pageSize?: string };
}

export type Pagination = {
  pageIndex: number;
  pageSize: number;
}

/** The context after `usePaginationQueryParameters`. */
export type UsePaginationQueryParametersContext = ServiceRequestContext & {
  pagination: Pagination;
}

const isIndex = (value: number) => Number.isInteger(value) && value >= 0;
const isSize = (value: number) => Number.isInteger(value) && value > 0;

/**
 * Reads the page index and size from the URL's query (`?pi=0&ps=20`) into `context.pagination`.
 * A URL missing either is redirected (302) to the same URL with the default added, so every
 * page has one address; a value that isn't a whole number in range is replaced by the default.
 */
export const usePaginationQueryParameters = (
  options: UsePaginationQueryParametersOptions,
): Middleware<ServiceRequestContext, UsePaginationQueryParametersContext> => {
  if (isIndex(options.defaultPageIndex) === false) {
    throw new TypeError('The default page index must be a whole number, 0 or more');
  }
  if (isSize(options.defaultPageSize) === false) {
    throw new TypeError('The default page size must be a whole number, 1 or more');
  }
  if (options.maxPageSize !== undefined && (isSize(options.maxPageSize) === false || options.maxPageSize < options.defaultPageSize)) {
    throw new TypeError('The largest page size must be a whole number, at least the default page size');
  }

  const indexName = options.names?.pageIndex ?? 'pi';
  const sizeName = options.names?.pageSize ?? 'ps';

  return async (context) => {
    const url = parseRequestUrl(context.incomingMessage.url);
    const pageIndex = url.searchParams.get(indexName);
    const pageSize = url.searchParams.get(sizeName);

    if (pageIndex === null || pageSize === null) {
      if (pageIndex === null) url.searchParams.set(indexName, String(options.defaultPageIndex));
      if (pageSize === null) url.searchParams.set(sizeName, String(options.defaultPageSize));
      return void context.serverResponse.sendFoundRedirect(`${url.pathname}${url.search}`);
    }

    const index = Number(pageIndex);
    const size = Number(pageSize);
    context.pagination = {
      pageIndex: isIndex(index) ? index : options.defaultPageIndex,
      pageSize: isSize(size)
        ? Math.min(size, options.maxPageSize ?? size)
        : options.defaultPageSize,
    };
  };
}
