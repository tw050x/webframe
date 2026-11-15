# @webframe/assert-unreachable

Marks code that can't be reached, such as the default of a `switch` that covers every case. If a case is added later and not handled, TypeScript reports it; if it's reached anyway at runtime, it throws. It has no dependencies and works anywhere, in Node and in browsers.

```sh
npm install @webframe/assert-unreachable
```

```ts
import { assertUnreachable } from '@webframe/assert-unreachable'

type Status = 'active' | 'suspended'

function label(status: Status) {
  switch (status) {
    case 'active': return 'Active'
    case 'suspended': return 'Suspended'
    default: return assertUnreachable(status, `Unknown status: ${status}`)
  }
}
```

The message is optional; without one it throws "Unreachable code reached". It's also the package's default export, and [`@webframe/utils`](https://webframe.tw050x.net/packages/utils) re-exports it.

The full documentation is at [webframe.tw050x.net/packages/assert-unreachable](https://webframe.tw050x.net/packages/assert-unreachable).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
