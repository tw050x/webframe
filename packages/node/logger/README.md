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

The full documentation is at [webframe.tw050x.net/packages/logger](https://webframe.tw050x.net/packages/logger).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
