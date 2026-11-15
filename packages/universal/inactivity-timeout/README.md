# @webframe/inactivity-timeout

A timeout that runs once nothing has happened for a while: an idle socket to close, or a user to sign out. Call `reset` whenever something happens. It works in Node and in browsers.

```sh
npm install @webframe/inactivity-timeout
```

```ts
import { createInactivityTimeout } from '@webframe/inactivity-timeout'

const timeout = createInactivityTimeout({
  onTimeout: () => socket.end(),
  timeoutInMilliseconds: 60_000,
})

socket.on('data', () => timeout.reset())
socket.on('close', () => timeout.clear())
timeout.start()
```

The full documentation is at [webframe.tw050x.net/packages/inactivity-timeout](https://webframe.tw050x.net/packages/inactivity-timeout).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
