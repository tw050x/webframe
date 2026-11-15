# Getting started

webframe needs Node 22 or later. It's written in TypeScript and ships its own types, so it works from JavaScript too.

```sh
npm install @webframe/core
```

## A first server

```ts
import { defineServer, defineMiddleware } from '@webframe/core'

const hello = defineMiddleware([
  async ({ serverResponse }) => {
    serverResponse.sendOKTextResponse('Hello')
  },
])

const server = defineServer({
  port: 3000,
  routes: {
    'GET /': hello,
  },
})

await server.listen()
```

`GET /` now answers `Hello`. Every server also answers `GET /healthcheck` with `Healthy`, and anything that matches no route with a 404.

## Adding middleware

Install the middleware you want and put it in the chain:

```sh
npm install @webframe/use-log-request @webframe/use-pagination-query-parameters
```

```ts
import { defineMiddleware } from '@webframe/core'
import { useLogRequest } from '@webframe/use-log-request'
import { usePaginationQueryParameters } from '@webframe/use-pagination-query-parameters'

export const listUsers = defineMiddleware([
  useLogRequest(),
  usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20 }),
  async ({ pagination, serverResponse }) => {
    const users = await findUsers(pagination.pageIndex, pagination.pageSize)
    serverResponse.sendOKJSONResponse(users)
  },
])
```

`usePaginationQueryParameters` adds `pagination` to the context, so the last step can use `pagination.pageSize` as a number. Without the pagination step there, `pagination` wouldn't exist and TypeScript would say so. [Middleware](./middleware) explains how this works, and how to write your own.

## What's next

- [The server](./server): ports, HTTPS and mutual TLS, starting and stopping.
- [Routing](./routing): route patterns and how they're matched.
- [Middleware](./middleware): the chain and its types.
- [Requests and responses](./requests-and-responses): reading bodies and parameters, and sending responses.
