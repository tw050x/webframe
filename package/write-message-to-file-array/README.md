# @webframe/write-message-to-file-array

This package provides an special Array class that writes pushed messages to a file and removes them from the array once they are written.

## Installation

```bash
npm install @webframe/write-message-to-file-array // or
yarn add @webframe/write-message-to-file-array
```

## Basic Example

```tsx
import { default as WriteMessageToFileArray } from '@webframe/write-message-to-file-array';

const array = new WriteMessageToFileArray('path/to/file.txt');

array.push('First!'); // writes 'First!' to file.txt
array.push('Second!'); // writes 'Second!' to file.txt

console.log(array); // ['First!', 'Second!']

setTimeout(() => {
  console.log(array); // []
}, 1000);
```

## Usage

The `WriteMessageToFileArray` class extends the native `Array` class, so you can use it like a normal array. The only difference is that when you push a message (of type `string`) to the array, it will be written to the file and removed from the array.

```tsx
const array = new WriteMessageToFileArray('path/to/file.txt');
array.push('Message'); // writes 'Message' to file.txt
```
