# @webframe/assert-unreachable

This package provides a utility function that throws an error if a code path is reached that should be unreachable. This is useful for catching logic errors in your code with typescript.

## Installation

```bash
npm install @webframe/assert-unreachable // or
yarn add @webframe/assert-unreachable
```

## Basic Example

```tsx
import { assertUnreachable } from '@webframe/assert-unreachable';

const values = [
  'one',
  'two',
  'three',
] as const

for (const value of values) {
  switch (value) {
    case 'one':
      console.log('one');
      break;
    case 'two':
      console.log('two');
      break;
    case 'three':
      console.log('three');
      break;
    default:
      // Throws a typescript error if the switch statement is not exhaustive
      assertUnreachable(value);
  }
}
```

## Usage

The `assertUnreachable()`'s first argument is the value that should be unreachable. The type of which should be `never`. If it is not never (i.e the switch statement is not exhaustive), typescript will throw an error.

The `assertUnreachable()`'s second argument is an optional message that is used for the error message.

```tsx
const value = true

if (value === true) {
  return
}

assertUnreachable(value, 'This should never happen');
```
