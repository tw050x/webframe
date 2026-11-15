# @webframe/config

Reads configuration, secrets and constants from a directory with a file for each key. That's how Docker and Kubernetes mount configs and secrets.

```sh
npm install @webframe/config
```

```ts
import { defineFileStore } from '@webframe/config'

export const configs = defineFileStore({ directory: '/run/configs' })
export const secrets = defineFileStore({ directory: '/run/secrets' })

configs.read('logs.level')                  // 'debug', from /run/configs/logs.level
configs.readOr('login.enabled', 'false')    // the fallback if there's no file
secrets.exists('google.client-secret')      // true or false
```

Keys are file names, so they can hold dots and other characters (`cors.*.allowed-origins`). Values are the file's contents, trimmed.

The full documentation is at [webframe.tw050x.net/packages/config](https://webframe.tw050x.net/packages/config).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
