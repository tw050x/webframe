# @webframe/utils

Small helpers used across webframe services.

```sh
npm install @webframe/utils
```

## assertUnreachable

Marks code that can't be reached, such as the default of a `switch` that covers every case. If a case is added later and not handled, TypeScript reports it; if it's reached anyway at runtime, it throws. It comes from [`@webframe/assert-unreachable`](./assert-unreachable), for code that needs only it.

```ts
import { assertUnreachable } from '@webframe/utils'

type Status = 'active' | 'suspended'

function label(status: Status) {
  switch (status) {
    case 'active': return 'Active'
    case 'suspended': return 'Suspended'
    default: return assertUnreachable(status, `Unknown status: ${status}`)
  }
}
```

## normaliseEmailAddress

Trims an email address, puts it in lower case, and removes a `+tag`, so one inbox is one account.

```ts
normaliseEmailAddress('  Ada+news@Example.com ') // 'ada@example.com'
```

## updateJSON

Sets a value at a dot path in a JSON string, making any objects on the way. It's handy for small preferences kept as JSON in a cookie.

```ts
updateJSON('{"menu":{}}', 'menu.open', true)  // '{"menu":{"open":true}}'
updateJSON('', 'a.b', 1)                      // '{"a":{"b":1}}'
```

Paths containing `__proto__`, `prototype` or `constructor` throw, so a path taken from a request can't alter every object in the program.
