# @webframe/inactivity-timeout

This package provides a utility function that when called returns a `start`, `clear` and `reset` function to manage an inactivity timeout. The timeout is reset when you call `reset`. 

You provide an onTimeout function that is called when the timeout is reached.

Additionally you cn provide a `timeout` value which is the time in milliseconds before the timeout is reached. The default value is 300000 milliseconds (30 seconds).

## Installation

```bash
npm install @webframe/inactivity-timeout // or
yarn add @webframe/inactivity-timeout
```

## Basic Example

```tsx
import { createInactivityTimeout } from '@webframe/inactivity-timeout';

const { clear, reset, start } = createInactivityTimeout({
  onTimeout: () => {
    console.log('Timeout reached after 1 second');
  },
  timeoutInMilliseconds: 1000,
});

document.getElementById('reset-button').addEventListener('click', () => {
  reset();
});

start();
```

## Usage

The `createInactivityTimeout()` function accepts an object with the following properties:

- `timeoutInMilliseconds` (optional): The time in milliseconds before the timeout is reached. The default value is 300000 milliseconds (30 seconds).
- `onTimeout`: A function that is called when the timeout is reached. If an `onTimeout` function is not provided, the call will throw an error.


The `createInactivityTimeout()` function returns an object with the following properties:

- `clear`: A function that clears the inactivity timeout.
- `start`: A function that starts the inactivity timeout.
- `reset`: A function that resets the inactivity timeout.

> Note: The `start` function must be called to start the inactivity timeout. If called while a timeout is in progress then an error will be thrown.

> The `reset` function must be called to reset the inactivity timeout. If called while a timeout is not in progress then an error will be thrown.

> The `clear` function must be called to clear the inactivity timeout. If called while a timeout is not in progress then an error will be thrown.

```tsx
const options = {
  onTimeout: () => {
    console.log('Timeout reached after 1 second');
  },
  timeoutInMilliseconds: 1000, // in milliseconds
}
```
