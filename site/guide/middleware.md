# Middleware

A route is a chain of middleware: small async functions, run in order, sharing one **context**.

```ts
const route = defineMiddleware([
  useLogRequest(),
  useUser,
  async ({ user, serverResponse }) => {
    serverResponse.sendOKJSONResponse({ hello: user.name })
  },
])
```

A middleware can do two things to the request, and may do both:

- **decorate the context**: add to it what the middleware after it need (`context.user = …`);
- **send the response**, which ends the chain.

`useUser` above decorates the context with `user`, and the last step sends the response. Some do their own work and pass the request on untouched: `useLogRequest` only logs it.

## The context

Every chain starts with the same three properties:

| Property | What it is |
|---|---|
| `incomingMessage` | The request: Node's `IncomingMessage` with [helpers](./requests-and-responses#reading-the-request) added. |
| `serverResponse` | The response: Node's `ServerResponse` with [send methods](./requests-and-responses#sending-a-response) added. |
| `logger` | The server's [logger](./errors-and-logging). |

Adding to the context is **decoration**. Each middleware can decorate it, and everything after it in the chain can use its decorations: the properties it added.

## Writing middleware

A middleware's type says what it needs and how it decorates the context:

```ts
import type { Middleware, ServiceRequestContext } from '@webframe/core'

type User = { id: string; name: string; roles: string[] }

// What the context holds once useUser has run
export type WithUser = ServiceRequestContext & { user: User }

export const useUser: Middleware<ServiceRequestContext, WithUser> = async (context) => {
  const user = await findUserBySession(context.incomingMessage.headers.cookie)
  if (user === null) {
    return context.serverResponse.sendUnauthorizedJSONResponse()
  }
  context.user = user
}
```

`Middleware<Input, Output>` takes the context it needs (`Input`) and the context it leaves behind (`Output`). Inside it, its decorations are optional until it sets them.

Middleware that needs options is usually a **factory**, a function that returns the middleware. All of webframe's own middleware is written this way, and their names start with `use`:

```ts
export const useRequireRole = (role: string): Middleware<WithUser> => async (context) => {
  if (context.user.roles.includes(role) === false) {
    return context.serverResponse.sendForbiddenTextResponse()
  }
}
```

A factory runs once, when the route is defined, so it's the place to check its options. `usePaginationQueryParameters` throws at that point if its defaults are invalid, rather than on each request.

### Needing something earlier in the chain

`useRequireRole` above takes `WithUser` as its input, so it only fits after `useUser`. If you put it before `useUser`, or leave `useUser` out, TypeScript reports an error on the chain.

## How the types flow

`defineMiddleware` types each middleware in the list by everything before it:

```ts
defineMiddleware([
  useUser,                                  // decorates it with user
  usePaginationQueryParameters({ … }),      // decorates it with pagination
  async ({ user, pagination }) => { … },    // both are typed here
])

defineMiddleware([
  async ({ user }) => { … },                // error: nothing decorated it with user
])
```

### Long chains

The first 30 middleware in a chain are typed. A chain can be longer: the ones after the 30th still run, and they see the first 30's decorations, but their own decorations are untyped.

## Stopping the chain

Before each middleware runs, the chain checks `serverResponse.sendingOrSent`. Once a response has been sent, the rest of the chain is skipped. This counts responses sent with the send methods and also ones written directly with `writeHead` or `end`.

So a check that fails just sends its response and returns, with no `next()` to call or forget:

```ts
const useLoginEnabledGate: Middleware = async ({ serverResponse }) => {
  if (configs.read('login.enabled') !== 'true') {
    return serverResponse.sendNotFoundTextResponse()
  }
}
```

## When nothing responds

If the whole chain runs without sending a response, it's a bug, so webframe logs an error and sends `500 Internal Server Error`. The client is never left waiting. Errors thrown by middleware are handled the same way: see [Errors and logging](./errors-and-logging).
