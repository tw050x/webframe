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

The full documentation is at [webframe.tw050x.net/packages/use-pagination-query-parameters](https://webframe.tw050x.net/packages/use-pagination-query-parameters).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
