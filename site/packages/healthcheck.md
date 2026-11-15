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

A [worker](../guide/workers) given it marks it unhealthy when it hits an error it can't recover from, so the container is restarted. Anything else can call `health.error()` itself.

```yaml
# compose.yaml
healthcheck:
  test: ["CMD", "grep", "-q", "^healthy$", "/tmp/health"]
  interval: 30s
```

Services with an HTTP server don't need it: [every server answers `GET /healthcheck`](../guide/server#healthchecks).

## Options

| Option | |
|---|---|
| `filePath` | The file to write `healthy` or `unhealthy` to. |
| `checkInterval` | How often to write it, in milliseconds. |

It writes the file once straight away, then on each interval. The timer doesn't keep the process alive by itself.

## Methods

| Name | What it does |
|---|---|
| `error()` | Marks the service unhealthy for good, writes that at once, and stops the timer. |
| `read()` | The status in the file. If the file holds anything else, it marks the service unhealthy and throws. |
| `stop()` | Stops writing, as the service shuts down. |
