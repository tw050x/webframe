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

## Functions

| Name | What it does |
|---|---|
| `generateKey()` | A new key: 32 random bytes, as 64 hex characters. |
| `encrypt(text, key)` | Encrypts a string. Returns JSON holding the IV, the authentication tag and the ciphertext. Each call uses a new IV, so the same text never encrypts the same way twice. |
| `decrypt(sealed, key)` | Decrypts what `encrypt` made and parses it as JSON. |

`decrypt` throws if what it's given isn't in `encrypt`'s format, was made with another key, has been altered, or doesn't decrypt to JSON. GCM's authentication tag is what catches alterations. The error's `cause` holds the underlying error.

The result of `decrypt` is `unknown`, so check its shape before using it.

## Keys

Keep the key out of your code: read it from a secret, for example with [`@webframe/config`](./config):

```ts
const key = secrets.read('state.encryption-key')
```

Changing the key makes everything encrypted with the old one unreadable. That's fine for short-lived state, but plan for it if you store what you encrypt.
