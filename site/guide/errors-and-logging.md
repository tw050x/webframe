# Errors and logging

## When something throws

If a middleware throws or its promise rejects, the chain stops, the error is logged at `error`, and the client gets `500 Internal Server Error` as text. If the response had already started, it's cut off instead, since its status can't be changed.

The same happens for a route handler written without `defineMiddleware`, and for any handler that finishes without responding, so no error goes unhandled and no request is left waiting.

To send your own error response, catch the error in the middleware and send it there:

```ts
async ({ incomingMessage, serverResponse }) => {
  try {
    await saveOrder(await incomingMessage.useJSONBody())
    serverResponse.sendCreatedJSONResponse()
  }
  catch (error) {
    if (error instanceof ValidationError) {
      return serverResponse.sendBadRequestJSONResponse({ message: error.message })
    }
    throw error // anything else becomes a 500
  }
}
```

## The logger

The server logs to the `logger` it's given, and puts the same logger on every request's context, so middleware logs to the same place:

```ts
async ({ logger, incomingMessage }) => {
  logger.info(`Signed in from ${incomingMessage.socket.remoteAddress}`)
}
```

A logger is anything with `debug`, `info`, `warn` and `error` methods, so `console` fits. Without one, the server uses `defaultLogger`, the console without debug lines. `silentLogger` drops everything, which suits tests.

### What webframe logs

| Level | |
|---|---|
| `debug` | The routes, as the server is defined. Every request, if you use [`useLogRequest`](../packages/use-log-request). |
| `info` | Requests that matched no route. |
| `error` | Errors thrown by middleware, and chains that sent no response. |

For JSON log files and readable console lines, use [`@webframe/logger`](../packages/logger):

```ts
import { createLogger } from '@webframe/logger'

defineServer({
  port: 3000,
  routes,
  logger: createLogger({ level: 'debug', directory: '/var/log/users' }),
})
```
