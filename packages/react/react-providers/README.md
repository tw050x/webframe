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

The full documentation is at [webframe.tw050x.net/packages/react-providers](https://webframe.tw050x.net/packages/react-providers).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
