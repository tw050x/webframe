# @webframe/encrypt

Encrypts and decrypts small pieces of state, such as the `state` of an OAuth sign-in or a value kept in a cookie, with AES-256-GCM.

```sh
npm install @webframe/encrypt
```

```ts
import { encrypt, decrypt, generateKey } from '@webframe/encrypt'

const key = generateKey() // keep it in a secret: 64 hex characters

const sealed = encrypt(JSON.stringify({ returnTo: '/account', nonce }), key)
// '{"iv":"…","tag":"…","content":"…"}'

decrypt(sealed, key) // { returnTo: '/account', nonce: '…' }
```

The full documentation is at [webframe.tw050x.net/packages/encrypt](https://webframe.tw050x.net/packages/encrypt).

Part of [webframe](https://webframe.tw050x.net), MIT licensed.
