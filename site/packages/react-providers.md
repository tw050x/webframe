# @webframe/react-providers

Nests React context providers from a list, rather than one inside another, with each provider's props type-checked. React is a peer dependency (16.14 or later).

```sh
npm install @webframe/react-providers
```

```tsx
import Providers, { createProvider } from '@webframe/react-providers'

const App = () => (
  <Providers
    providers={[
      createProvider(ThemeProvider),
      createProvider(LoggerProvider, { handler: console.info }),
    ]}
  >
    <Page />
  </Providers>
)
```

That renders the same as:

```tsx
<ThemeProvider>
  <LoggerProvider handler={console.info}>
    <Page />
  </LoggerProvider>
</ThemeProvider>
```

The first provider in the list is the outermost.

## createProvider

`createProvider(Component, props)` makes an entry for the list, checking `props` against the component:

- a provider with props that are required must be given them;
- a provider with no props takes none, or `{}`;
- a provider that needs `children` is fine without them, as `<Providers />` gives it them, so there's no `@ts-expect-error` to write.

`<Providers />` is the default export and is also exported as `Providers`.
