# The server

`defineServer` makes a server for your routes. It doesn't start listening until you call `listen()`.

```ts
import { defineServer } from '@webframe/core'

const server = defineServer({
  port: 3000,
  host: '127.0.0.1', // optional; every address by default
  routes,
  logger,            // optional; see Errors and logging
})

await server.listen()
```

## Options

| Option | |
|---|---|
| `port` | The port to listen on. `0` picks a free one, which is useful in tests. |
| `host` | The address to listen on. Node's default, every address, if left out. |
| `routes` | The [routes](./routing), as an object of `"METHOD /path"` keys and handlers. |
| `logger` | Where the server and its middleware log. Defaults to the console, without debug lines. |
| `tls` | Serve HTTPS instead of HTTP. See below. |

## HTTPS

Give `tls` the paths to a certificate and its key:

```ts
defineServer({
  port: 443,
  routes,
  tls: {
    certPath: '/run/secrets/server.crt',
    keyPath: '/run/secrets/server.key',
  },
})
```

### Mutual TLS

To require clients to present a certificate signed by one of your CAs, as services calling each other do, add `mutual`:

```ts
tls: {
  certPath: '/run/secrets/server.crt',
  keyPath: '/run/secrets/server.key',
  mutual: {
    caPaths: ['/run/secrets/ca.crt'],
    requestCert: true,         // the default
    rejectUnauthorized: true,  // the default
  },
}
```

## Starting and stopping

| Method | |
|---|---|
| `listen(callback?)` | Starts listening. Returns a promise that resolves once it is. |
| `close(callback?)` | Stops accepting connections. Resolves once the open ones have finished. |
| `address()` | The address it's listening on (`{ address, family, port }`), or `null` before `listen`. |
| `on(event, listener)` | Node's server events, such as `'error'` or `'clientError'`. |

A test can start a server on a free port and find out which one it got:

```ts
const server = defineServer({ port: 0, host: '127.0.0.1', routes, logger: silentLogger })
await server.listen()
const { port } = server.address()!
const response = await fetch(`http://127.0.0.1:${port}/users`)
await server.close()
```

## Healthchecks

Every server answers `GET /healthcheck` with `200 Healthy`, before any route is matched, so containers and load balancers can check it. To answer differently, give your own route for the `SYSTEM /healthcheck` key:

```ts
routes: {
  'SYSTEM /healthcheck': async ({ serverResponse }) => {
    if (await database.ping()) serverResponse.sendOKTextResponse('Healthy')
    else serverResponse.sendText(503, 'Unhealthy')
  },
}
```

A worker with no HTTP server can use [`@webframe/healthcheck`](../packages/healthcheck) instead, which writes its status to a file.
