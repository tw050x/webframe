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

The full documentation is at [webframe.tw050x.net/packages/use-cors-headers](https://webframe.tw050x.net/packages/use-cors-headers).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
