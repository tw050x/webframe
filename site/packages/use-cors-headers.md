# @webframe/use-cors-headers

Sets the [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) headers that let pages on other sites call your service.

```sh
npm install @webframe/use-cors-headers
```

```ts
import { defineMiddleware } from '@webframe/core'
import { useCorsHeaders } from '@webframe/use-cors-headers'

const cors = useCorsHeaders({
  allowedOrigins: ['app.example.com', 'localhost:5173'],
  allowedMethods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

const routes = {
  'GET /orders': defineMiddleware([cors, listOrders]),
  'POST /orders': defineMiddleware([cors, createOrder]),
  // the browser's preflight
  'OPTIONS /orders': defineMiddleware([cors, async ({ serverResponse }) => serverResponse.sendNoContentResponse()]),
}
```

It only sets headers. It doesn't answer preflight requests itself, so give each path an `OPTIONS` route that sends `204` after it, as above.

## Options

| Option | |
|---|---|
| `allowedOrigins` | The hosts allowed, such as `app.example.com` or `localhost:3000` (with the port, if it isn't the default), or `'*'` for any. It can also be a function, called for each request, which returns either of those or a comma-separated list. |
| `allowedMethods` | The methods allowed, in capitals, or `'*'`. |
| `allowedHeaders` | The headers a preflight may ask to send: an array, a comma-separated list, or `'*'` (the default). |

## What it sends

- `Access-Control-Allow-Origin`: `*`, or the request's own `Origin` when its host is allowed. Origins that aren't allowed get no header, and the browser blocks the response.
- `Vary: Origin`, when the origins are a list, so caches keep each origin's response apart.
- `Access-Control-Allow-Methods`: the methods allowed.
- `Access-Control-Allow-Headers`: the headers allowed, on preflights only.

Invalid methods throw when the middleware is made, not on a request.

## Origins from config

To change the allowed origins without restarting, pass a function. A [file store](./config) caches what it reads, so this is cheap on every request:

```ts
import { defineFileStore } from '@webframe/config'

const configs = defineFileStore({ directory: '/run/configs' })

useCorsHeaders({
  allowedOrigins: () => configs.read('cors.allowed-origins'), // "app.example.com, admin.example.com"
  allowedMethods: ['GET'],
})
```

## Helpers

| Name | What it does |
|---|---|
| `isAllowedOrigin(origin, hosts)` | Whether an `Origin` header's host is in the list. A missing or malformed origin isn't. |
| `isAllowedHeaders(list, allowed)` | Whether every header in an `Access-Control-Request-Headers` list is allowed, ignoring case. |
