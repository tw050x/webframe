# @webframe/healthcheck

A healthcheck for services with no HTTP server, such as queue workers. It writes the service's health to a file every so often, and the container's healthcheck reads it.

```sh
npm install @webframe/healthcheck
```

```ts
import { defineHealthcheck } from '@webframe/healthcheck'

const worker = defineWorker({
  source,
  jobs,
  health: defineHealthcheck({ filePath: '/tmp/health', checkInterval: 10_000 }),
})
```

A [worker](https://webframe.tw050x.net/guide/workers) given it marks it unhealthy when it hits an error it can't recover from, so the container is restarted. Anything else can call `health.error()` itself.

```yaml
# compose.yaml
healthcheck:
  test: ["CMD", "grep", "-q", "^healthy$", "/tmp/health"]
  interval: 30s
```

Services with an HTTP server don't need it: [every server answers `GET /healthcheck`](https://webframe.tw050x.net/guide/server#healthchecks).

The full documentation is at [webframe.tw050x.net/packages/healthcheck](https://webframe.tw050x.net/packages/healthcheck).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
