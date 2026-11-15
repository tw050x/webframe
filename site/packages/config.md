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

## Options

| Option | |
|---|---|
| `directory` | The directory to read from, resolved from the working directory. |
| `ttl` | How long a value is cached, in milliseconds. 5 minutes by default; `0` reads the file every time. |

## Methods

| Name | What it does |
|---|---|
| `read(key)` | The key's value. Throws if it has no file. |
| `readOr(key, fallback)` | The key's value, or the fallback if it has no file. |
| `exists(key)` | Whether the key has a file. |
| `clear()` | Forgets the cached values, so the next reads read the files. |

A key that would reach outside the directory, such as `../other` or `/etc/passwd`, throws.

## Caching

Values are cached for the `ttl`, so reading one on every request is cheap, and a changed file is picked up within that time without restarting.
