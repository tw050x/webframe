# @webframe/use-log-request

Logs each request's method and URL to the server's [logger](../guide/errors-and-logging).

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

## Options

| Option | |
|---|---|
| `level` | The level to log at: `'debug'` (the default), `'info'`, `'warn'` or `'error'`. |

Put it first in the chain, so requests are logged even when a later middleware responds early.
