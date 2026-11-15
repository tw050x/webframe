# Requests and responses

`context.incomingMessage` and `context.serverResponse` are Node's own request and response, with helpers added. Everything Node offers on them, such as `headers`, `method`, `setHeader` and `end`, still works.

## Reading the request

### Bodies

```ts
const body = await incomingMessage.useJSONBody()      // unknown, or null
const form = await incomingMessage.useFormDataBody()  // Record<string, string>, or null
const text = await incomingMessage.readBody()         // string, or null
```

| Method | Gives |
|---|---|
| `useJSONBody()` | The parsed JSON. `null` if the body is empty, isn't JSON, or is over the limit. |
| `useFormDataBody()` | An `application/x-www-form-urlencoded` body as an object of strings. `{}` for an empty body, `null` if it's over the limit. |
| `readBody()` | The body as text. `null` if it's over the limit or the upload failed. |

Bodies are limited to 1 MiB by default. A longer body reads as `null`, and the upload is stopped. Pass another limit, in bytes, to any of them:

```ts
await incomingMessage.useJSONBody({ limit: 10 * 1024 * 1024 })
```

The body is read from the network only once, so reading it again, even with another method, gives the same text.

`useJSONBody` returns `unknown`. Check its shape before using it, with a schema library or your own type guard.

### URL parameters and the query

```ts
// GET /orders/456/items/789?ref=abc&page=2
incomingMessage.useUrlParams('/orders/:orderId/items/:itemId')
// { orderId: '456', itemId: '789' }

incomingMessage.useUrlQuery()
// { ref: 'abc', page: '2' }
```

Both are decoded. `useUrlParams` gives `{}` when the path doesn't fit the pattern. When a query repeats a key, `useUrlQuery` keeps its last value.

## Sending a response

Every send method sets the status and `Content-Type`, sends the body, and ends the chain.

### The general methods

```ts
serverResponse.sendText(418, "I'm a teapot")
serverResponse.sendJSON(200, { id: 1 })
serverResponse.sendHTML(200, '<h1>Hello</h1>')
serverResponse.sendRedirect(307, '/elsewhere')
```

### Named for their status

| Status | Methods |
|---|---|
| 200 | `sendOKTextResponse(text?)`, `sendOKJSONResponse(body?)`, `sendOKHTMLResponse(html)` |
| 201 | `sendCreatedJSONResponse(body?)` |
| 202 | `sendAcceptedJSONResponse(body?)` |
| 204 | `sendNoContentResponse()` (no body, as 204 requires) |
| 301 | `sendMovedPermanentlyRedirect(url)` |
| 302 | `sendFoundRedirect(url)`, `sendMovedTemporarilyRedirect(url)` |
| 303 | `sendSeeOtherRedirect(url)` |
| 400 | `sendBadRequestJSONResponse(body?)`, `sendBadRequestHTMLResponse(html)` |
| 401 | `sendUnauthorizedJSONResponse(body?)`, `sendUnauthorizedHTMLResponse(html)` |
| 403 | `sendForbiddenTextResponse(text?)`, `sendForbiddenHTMLResponse(html)` |
| 404 | `sendNotFoundTextResponse(text?)`, `sendNotFoundJSONResponse(body?)`, `sendNotFoundHTMLResponse(html)` |
| 500 | `sendInternalServerErrorTextResponse(text?)`, `sendInternalServerErrorJSONResponse(body?)`, `sendInternalServerErrorHTMLResponse(html)` |
| 501 | `sendNotImplementedTextResponse(text?)` |

Without a body, a JSON method sends `{ "message": "…" }` with the status's name, such as `{ "message": "not found" }`, and a text method sends the status's name.

### HTML

The HTML methods take a string, a promise of one, or a readable stream. That covers a template string, JSX rendered by [`@kitajs/html`](https://github.com/kitajs/html) (a string or promise), and its streaming `renderToStream`:

```tsx
import { renderToStream } from '@kitajs/html/suspense'

serverResponse.sendOKHTMLResponse(<UserPage user={user} />)
serverResponse.sendOKHTMLResponse(renderToStream((rid) => <Dashboard rid={rid} />))
```

If the promise rejects or the stream fails, the response is cut off, because its status has already been sent.

### Redirects and htmx

The redirect methods take a `URL` or a string. For an [htmx](https://htmx.org) request (one with the `HX-Request: true` header), they send the address in `HX-Redirect` instead of `Location`. htmx then loads it as a whole page instead of swapping the redirect's body into the current one.

### Has it been sent?

`serverResponse.sendingOrSent` is `true` once a response has started. That covers the send methods, and headers written or the response ended directly. This is how the chain knows to stop.
