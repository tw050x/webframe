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

## Options

| Option | What it does |
|---|---|
| `onTimeout` | Called once the timeout is reached. |
| `timeoutInMilliseconds` | How long nothing has to happen. 30 seconds by default. |

## What it returns

| Name | What it does |
|---|---|
| `start()` | Starts the timeout. Throws if it's already started. |
| `reset()` | Starts it again from now. Throws if it isn't started. After it has run, `reset` starts it again. |
| `clear()` | Stops it. Throws if it isn't started. |
| `id` | The timer once started (even after it has run), until it's cleared; otherwise `null`. |
