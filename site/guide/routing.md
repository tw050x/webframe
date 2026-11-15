# Routing

Routes are an object. Each key is a method and a path, and each value is the handler for it, usually made with [`defineMiddleware`](./middleware).

```ts
const routes = {
  'GET /users': listUsers,
  'POST /users': createUser,
  'GET /users/me': showCurrentUser,
  'GET /users/:id': showUser,
  'GET /users/:id/posts/:post': showPost,
}
```

The method can be written in any case. A segment starting with `:` matches any one non-empty segment.

## How a request is matched

1. **`GET /healthcheck`** is answered first. See [healthchecks](./server#healthchecks).
2. **A trailing slash** is redirected away: `/users/` gets a `301` to `/users`, keeping the query. Only `/` itself keeps its slash.
3. **An exact match** wins: `GET /users/me` goes to `showCurrentUser`, not `showUser`.
4. **Patterns with parameters** come next, the ones with the most segments first, so `/users/:id/posts/:post` is tried before `/users/:id`. A pattern only matches a path with the same number of segments.
5. **Anything else** goes to the `ERROR 404` route.

The query string never affects matching.

## Reading parameters

The router finds the route but doesn't store the parameters. Read them from the request with the route's pattern:

```ts
const showUser = defineMiddleware([
  async ({ incomingMessage, serverResponse }) => {
    const { id } = incomingMessage.useUrlParams('/users/:id')
    serverResponse.sendOKJSONResponse(await findUser(id))
  },
])
```

Values are URL-decoded. If the path doesn't fit the pattern, `useUrlParams` returns `{}`.

## Not found

Requests that match nothing get `404 page not found` as text, and the server logs them at `info`. To send something else, such as an HTML page, give a route for the `ERROR 404` key:

```ts
routes: {
  'ERROR 404': async ({ serverResponse }) => {
    serverResponse.sendNotFoundHTMLResponse(renderNotFoundPage())
  },
}
```

## Preflight requests

CORS preflights are `OPTIONS` requests, and they're routed like any other: give the path an `OPTIONS` route. See [`@webframe/use-cors-headers`](../packages/use-cors-headers).
