# @webframe/core

The server, its router, the middleware chain, the request and response classes, and workers. It has no dependencies.

```sh
npm install @webframe/core
```

## Exports

### Functions

| Name | What it does |
|---|---|
| `defineServer(options)` | Makes a server for your routes. See [The server](../guide/server). |
| `defineMiddleware(middlewares)` | Makes a route from a chain of middleware, the first 30 typed. See [Middleware](../guide/middleware). |
| `defineWorker(options)` | Makes a worker that runs jobs from a source. See [Workers](../guide/workers). |
| `defineIntervalSource(schedule)`, `defineMemorySource()` | The job sources that come with core: a timer, and a queue in memory. |
| `createRequestHandler({ routes, logger })` | The router `defineServer` uses, for attaching to a Node server of your own. Its `routes` is a `Map`. |
| `parseRequestUrl(target)` | Parses a request's URL. A path starting `//` stays a path, where `new URL` would read it as another host. |
| `isHttpMethod(value)`, `isArrayOfHttpMethods(value)`, `isAllowedMethod(value, methods)` | Type guards for HTTP methods, in capitals. |

### Classes

| Name | What it is |
|---|---|
| `ContextualIncomingMessage` | The request. See [Reading the request](../guide/requests-and-responses#reading-the-request). |
| `ContextualServerResponse` | The response. See [Sending a response](../guide/requests-and-responses#sending-a-response). |
| `WorkerStoppingError`, `UnknownJobError` | Why a worker refused a job: it's stopping, or the job's name has no handler. |

### Values

| Name | What it is |
|---|---|
| `defaultLogger` | The console, without debug lines. Used when a server isn't given a logger. |
| `silentLogger` | Drops everything. Useful in tests. |
| `httpMethods` | The nine HTTP methods. |
| `DEFAULT_BODY_LIMIT` | The largest body read by default: 1 MiB. |
| `TYPED_CHAIN_LENGTH` | How many middleware in a chain are typed: 30. |

### Types

| Name | What it is |
|---|---|
| `Middleware<Input, Output>` | A step in a chain: given `Input`, it adds what `Output` has beyond it. `Output` defaults to `Input`. |
| `ServiceRequestContext` | What every chain starts with: `incomingMessage`, `serverResponse`, `logger`. |
| `RouteHandler` | What a route is: `(context) => void \| Promise<void>`. |
| `Routes`, `ServerOptions`, `Server` | `defineServer`'s routes, options and result. |
| `Logger` | Anything with `debug`, `info`, `warn` and `error`. |
| `Html` | What the HTML send methods take: a string, a promise of one, or a readable stream. |
| `HttpMethod` | `'GET' \| 'POST' \| …` |
| `ReadBodyOptions` | `{ limit?: number }`, for the body readers. |
| `Job`, `JobHandler`, `JobContext`, `JobSource`, `SourceControls`, `WorkerHealth`, `WorkerOptions`, `Worker`, `MemorySource`, `IntervalSchedule` | The worker's types. See [Workers](../guide/workers). |
| `NewPropertiesOnly<A, B>`, `DeepPartial<T>` | The helper types the chain is built from. |
