# @webframe/logger

A [winston](https://github.com/winstonjs/winston) logger set up for a webframe service: JSON lines to files, and readable lines to the console.

```sh
npm install @webframe/logger
```

```ts
import { defineServer } from '@webframe/core'
import { createLogger } from '@webframe/logger'

const logger = createLogger({ level: 'debug', directory: '/var/log/orders' })

defineServer({ port: 3000, routes, logger })
```

## Options

| Option | |
|---|---|
| `level` | The lowest level logged: `error`, `warn`, `info` (the default), `debug`… |
| `directory` | Where to write `combined.log` (everything) and `error.log` (errors only), as JSON lines with timestamps. No files if left out. |
| `console` | Whether to also log to the console. By default, only when `NODE_ENV` isn't `production`. |

Errors are logged with their stack. On the console, debug lines leave out the timestamp to stay short.

It returns a winston `Logger`, which fits webframe's `Logger`, so anything winston offers, such as other transports or child loggers, works on it.
