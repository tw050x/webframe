# @webframe/react-providers

This package provides a utility component for react along with a helper function to wrap a component tree with providers in a typesafe way.

## Installation

```bash
npm install @webframe/react-providers // or
yarn add @webframe/react-providers
```

## Basic Example

```tsx
import React from 'react';
import Providers, { createProvider } from '@webframe/react-providers';

const App = () => {
  return (
    <Providers
      providers={[
        createProvider(Provider1),
        createProvider(Provider2, { prop1: 'value1' }),
      ]}
    >
      <Component />
    </Providers>
  );
};
```
## Usage

The `<Providers />` component accepts a single prop `providers` which is an array of objects containing the Component and the props. See below 

```tsx
const providers = [
  { Component: Provider1, props: {} },
  { Component: Provider2, props: { prop1: 'value1' } },
];
```

Use the `createProvider` helper to create the object to pass to the `<Providers />` component. See below

```tsx
const providers = [
  createProvider(Provider1),
  createProvider(Provider2, { prop1: 'value1' }),
];
```

The `createProvider` helper returns an object of the correct structure for the `<Providers />` component. It also typechecks the provider component and the props passed to it.

You can then pass the providers array to the `<Providers />` component to wrap the component tree with the providers.

```tsx
<Providers providers={providers}>
  <Component />
</Providers>
```

Components are wrapped in order with the first in the list being the outermost provider.
