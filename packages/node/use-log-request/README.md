# @webframe/use-log-request

Logs each request's method and URL to the server's [logger](https://webframe.tw050x.net/guide/errors-and-logging).

```sh
npm install @webframe/use-log-request
```

```ts
import { defineMiddleware } from '@webframe/core'
import { useLogRequest } from '@webframe/use-log-request'

defineMiddleware([
  useLogRequest(),
  showUser,
])
// debug: GET /users/42?tab=posts
```

The full documentation is at [webframe.tw050x.net/packages/use-log-request](https://webframe.tw050x.net/packages/use-log-request).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
