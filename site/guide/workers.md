# Workers

A worker runs jobs in the background: sending emails, expiring sessions, anything that shouldn't hold up a request. `defineWorker` is the worker's counterpart to `defineServer`. You give it a handler for each kind of job and the **sources** the jobs come from, and it runs them.

```ts
import { defineWorker, defineIntervalSource } from '@webframe/core'
import { defineHealthcheck } from '@webframe/healthcheck'

const worker = defineWorker({
  source: defineIntervalSource({ ExpireSessions: 60_000 }),
  jobs: {
    ExpireSessions: async (_data, { logger }) => {
      const count = await sessions.expireInactive()
      logger.info(`Expired ${count} sessions`)
    },
  },
  health: defineHealthcheck({ filePath: '/healthcheck', checkInterval: 15_000 }),
})

await worker.start()
```

## Jobs

A job has a `name`, which picks its handler, and `data`. Each handler is given the job's data and a context holding the job itself and the logger:

```ts
jobs: {
  SendWelcomeEmail: async (data, { job, logger }) => {
    if (!isWelcomeEmail(data)) throw new Error(`Bad data for job ${job.id}`)
    await email.send(data.to, welcome(data.name))
  },
}
```

`data` comes from outside the program, so it's `unknown`: check its shape before using it.

- **A handler that resolves** means the job is done.
- **A handler that throws** means the job failed. The error is logged, and the source decides whether to try again.
- **A job whose name has no handler** fails with an `UnknownJobError`.

A failed job never stops the worker.

## Sources

A source delivers the jobs. webframe doesn't depend on any queue, so a queue plugs in as a source. Two sources come with core:

| Source | |
|---|---|
| `defineIntervalSource(schedule)` | Runs jobs on a timer: `{ ExpireSessions: 60_000 }`, or `{ Report: { every: 3_600_000, data: { … }, immediately: true } }` to also run once at start. A job still running when its next turn comes skips that turn, so it never overlaps itself. |
| `defineMemorySource()` | A queue held in memory. `source.add(name, data)` adds a job and resolves once it's done, or rejects if it failed. It suits tests and work a service hands itself. Jobs are lost if the process ends, and failed jobs aren't retried. |

### Several sources

One worker can take jobs from several sources, sharing the same handlers. For example, a timer and a queue:

```ts
const queue = defineMemorySource()

defineWorker({
  source: [defineIntervalSource({ ExpireSessions: 60_000 }), queue],
  jobs: {
    ExpireSessions: async () => { … },          // every minute
    SessionActivity: async (data) => { … },     // whenever one is added to the queue
  },
})
```

The sources start in order. If one fails to start, the ones already started are stopped and the worker fails.

### Writing a source

A source is an object with `start` and `stop`:

```ts
import type { JobSource } from '@webframe/core'

const source: JobSource = {
  start({ handle, fail, logger }) {
    queue.onMessage(async (message) => {
      try {
        await handle({ name: message.type, data: message.body, id: message.id })
        await message.ack()
      }
      catch {
        await message.retryLater()
      }
    })
    queue.onDisconnect((error) => fail(error))
  },
  async stop() {
    await queue.stopReceiving()
  },
}
```

| Name | What it does |
|---|---|
| `handle(job)` | Runs a job. Resolves once it's done, rejects if it failed. While the worker is stopping, it rejects with a `WorkerStoppingError`, and the job should go back to the queue. |
| `fail(error)` | Reports an error the source can't recover from, such as a lost connection. The worker stops and is marked unhealthy. |
| `logger` | The worker's logger. |

`stop` must stop delivering jobs. The worker calls it first when shutting down.

## Options

| Option | |
|---|---|
| `source` | Where jobs come from: one source, or a list of them. |
| `jobs` | A handler for each job, by name. |
| `logger` | Where to log. The console without debug lines by default. |
| `concurrency` | How many jobs run at once. 1 by default. |
| `health` | Where to report the worker's health, such as a healthcheck from [`@webframe/healthcheck`](../packages/healthcheck). |
| `shutdownTimeout` | How long stopping waits for running jobs, in milliseconds. 30 seconds by default. |
| `handleSignals` | Stop gracefully on SIGINT and SIGTERM. On by default. |
| `exitProcess` | End the process once stopped by a signal (code 0) or a fatal error (code 1). On by default. Turn it and `handleSignals` off in tests. |

## Stopping

On SIGINT or SIGTERM, as when a container is stopped, the worker:

1. stops its sources, so no new jobs arrive;
2. waits for running jobs to finish, for up to `shutdownTimeout`;
3. stops the healthcheck and ends the process.

A second signal while it's stopping ends the process at once. Jobs waiting for their turn when it stops aren't started, and are handed back to the source.

`worker.stop()` does the same without ending the process. `worker.running` says how many jobs are running.

## Fatal errors

When a source calls `fail`, or `worker.fail(error)` is called, the worker logs the error, marks its health unhealthy, stops as above, and ends the process with code 1, so the container is restarted. If a source fails to start, the worker fails the same way.
