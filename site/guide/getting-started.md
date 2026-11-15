# Getting started

webframe needs Node 22 or later. It's written in TypeScript and ships its own types, so it works from JavaScript too.

```sh
npm install @webframe/core
```

## What it's designed for

webframe is designed for server-rendered apps built with [htmx](https://htmx.org) and [KitaJS](https://github.com/kitajs/html): the server sends HTML, and htmx swaps it into the page.

- **htmx:** responses know about htmx requests. A redirect sends `HX-Redirect` instead of `Location`, so htmx loads the new page whole rather than swapping it into the current one.
- **KitaJS:** the HTML methods take what `@kitajs/html` renders: a string, a promise of one, or its streaming `renderToStream`.

Neither is a dependency, and neither is required.

- **Other templates:** any templating framework that renders a string or a stream works the same way, whether that's a template literal, EJS, Handlebars, Nunjucks or JSX of another kind.
- **An API only:** webframe can also serve just an API and send no HTML at all. It has JSON responses (`sendOKJSONResponse` and the others) and JSON and form bodies, with CORS from [`@webframe/use-cors-headers`](../packages/use-cors-headers). The front end can be React, Vue, Svelte, a mobile app or anything else that makes HTTP requests. For React, [`@webframe/react-providers`](../packages/react-providers) is in the family too.

[Requests and responses](./requests-and-responses#html) shows sending HTML, KitaJS's streams and [the htmx redirects](./requests-and-responses#redirects-and-htmx).

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
