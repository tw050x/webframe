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
import Providers, { createProviderWithProps } from '@webframe/react-providers';

const App = () => {
  return (
    <Providers
      providers={[
        createProviderWithProps(Provider1),
        createProviderWithProps(Provider2, { prop1: 'value1' }),
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

Use the `createProviderWithProps` helper to create the object to pass to the `<Providers />` component. See below

```tsx
const providers = [
  createProviderWithProps(Provider1),
  createProviderWithProps(Provider2, { prop1: 'value1' }),
];
```

The `createProviderWithProps` helper returns an object of the correct structure for the `<Providers />` component. It also typechecks the provider component and the props passed to it.

Components are wrapped in order with the first in the list being the outermost provider.
