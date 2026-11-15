# webframe

Typed middleware for Node's HTTP server, and the helpers that go with it, published under the
`@webframe` scope on npm. Taken from the tw050x.net legacy platform library
(`tw050x.net-legacy/master/library/platform`). `assert-unreachable`, `inactivity-timeout` and
`react-providers` came from this repo's earlier Nx monorepo, and carry on from their published versions.

```ts
import { defineServer, defineMiddleware } from "@webframe/core";
import { useLogRequest } from "@webframe/use-log-request";
import { usePaginationQueryParameters } from "@webframe/use-pagination-query-parameters";

const listUsers = defineMiddleware([
  useLogRequest(),
  usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20 }),
  async ({ pagination, serverResponse }) => {
    // pagination is typed: usePaginationQueryParameters added it
    serverResponse.sendOKJSONResponse(await findUsers(pagination));
  },
]);

await defineServer({ port: 3000, routes: { "GET /users": listUsers } }).listen();
```

Each middleware is given the context the ones before it built, and may add to it, send the
response (which ends the chain), or both. If none responds, or one throws, a 500 is sent.

## Packages

They're grouped by where they run, in `packages/<group>/<name>`.

**Node** (`packages/node`): servers and workers.

| Package | What it is |
|---|---|
| `@webframe/core` | `defineServer` (HTTP or HTTPS, mutual TLS), the router (`"GET /users/:id"`), `defineMiddleware`, the request and response classes, and `defineWorker` with its job sources |
| `@webframe/use-cors-headers` | `useCorsHeaders` |
| `@webframe/use-log-request` | `useLogRequest` |
| `@webframe/use-pagination-query-parameters` | `usePaginationQueryParameters` |
| `@webframe/config` | `defineFileStore`: configs, secrets and constants read from a file per key |
| `@webframe/logger` | `createLogger`: winston, JSON to files and readable lines to the console |
| `@webframe/encrypt` | `encrypt`, `decrypt`, `generateKey` (AES-256-GCM) |
| `@webframe/healthcheck` | `defineHealthcheck`: a status file for container healthchecks |

**Universal** (`packages/universal`): plain JavaScript for any runtime, Node, browsers, workers, Bun or
Deno. They're built without Node's types, so one that reaches for Node doesn't compile.

| Package | What it is |
|---|---|
| `@webframe/utils` | `assertUnreachable` (from `@webframe/assert-unreachable`), `normaliseEmailAddress`, `updateJSON` |
| `@webframe/assert-unreachable` | `assertUnreachable` |
| `@webframe/inactivity-timeout` | `createInactivityTimeout` |

**React** (`packages/react`): React as a peer dependency.

| Package | What it is |
|---|---|
| `@webframe/react-providers` | `<Providers />` and `createProvider` |

## Working on it

- `npm run middleware-types` writes `defineMiddleware`'s overloads (typed to `TYPED_CHAIN_LENGTH`,
  30) into `packages/node/core/src/middleware.ts`; a test fails if they're out of date.
- `npm run build` builds every package with `tsc --build` (TypeScript 5.9, project references).
- `npm test` builds, then runs `node --test` on `test/`. `test/types/` is checked by the build:
  it holds what the chain's types must accept and refuse.
- `.github/workflows`: Prerequisites (tests and the docs' build, on every push) and Website
  (publishes the docs to GitHub Pages when `site/` changes on master).

## Layout

- `packages/<group>/<name>` — `@webframe/<name>` (groups `node`, `universal`, `react`), its source in `src`, built to `dist`
- `test/` — tests across the packages
- `site/` — the docs site, webframe.tw050x.net (VitePress; `npm run docs` serves it, `npm run docs:build` builds it)
