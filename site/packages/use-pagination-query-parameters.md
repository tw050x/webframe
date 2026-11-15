# @webframe/use-pagination-query-parameters

Reads the page index and size from the URL's query into `context.pagination`.

```sh
npm install @webframe/use-pagination-query-parameters
```

```ts
import { defineMiddleware } from '@webframe/core'
import { usePaginationQueryParameters } from '@webframe/use-pagination-query-parameters'

defineMiddleware([
  usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20, maxPageSize: 100 }),
  async ({ pagination, serverResponse }) => {
    // GET /users?pi=2&ps=20 → { pageIndex: 2, pageSize: 20 }
    const users = await findUsers({ skip: pagination.pageIndex * pagination.pageSize, limit: pagination.pageSize })
    serverResponse.sendOKJSONResponse(users)
  },
])
```

## Options

| Option | |
|---|---|
| `defaultPageIndex` | The page when the URL doesn't say, counting from 0. |
| `defaultPageSize` | How many to a page when the URL doesn't say. |
| `maxPageSize` | The largest page size a URL may ask for. Larger sizes are cut down to it. No limit if left out. |
| `names` | The query's names for the two parameters: `{ pageIndex: 'pi', pageSize: 'ps' }` by default. |

The options are checked when the middleware is made: the defaults must be whole numbers (the index 0 or more, the size 1 or more), and `maxPageSize` at least the default size.

## How it reads the URL

- **Missing parameters** are added: a URL without `pi` or `ps` gets a `302` redirect to the same URL with the default added. That gives every page one address, which links, caches and the browser's history can rely on.
- **Values that aren't whole numbers in range** (`ps=abc`, `pi=-1`) are replaced by the default.
- **A size over `maxPageSize`** is cut down to it.

## Context

It adds `pagination: { pageIndex: number; pageSize: number }`. The type of the context it leaves is exported as `UsePaginationQueryParametersContext`, for middleware that needs it:

```ts
import type { Middleware } from '@webframe/core'
import type { UsePaginationQueryParametersContext } from '@webframe/use-pagination-query-parameters'

const useOffset: Middleware<UsePaginationQueryParametersContext> = async ({ pagination }) => { … }
```
