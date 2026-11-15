import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = 'aes-256-gcm';

/**
 * Makes a key for `encrypt` and `decrypt`: 32 random bytes, as hex.
 */
export const generateKey = (): string => randomBytes(32).toString('hex');

const keyOf = (key: string) => {
  const bytes = Buffer.from(key, 'hex');
  if (bytes.length !== 32) {
    throw new Error('The key must be 32 bytes, as 64 hex characters');
  }
  return bytes;
}

/**
 * Encrypts a string with a key (64 hex characters, from `generateKey`). The result is JSON
 * holding the IV, the authentication tag and the ciphertext, so it can't be altered unnoticed.
 *
 * @example
 * const sealed = encrypt(JSON.stringify({ returnTo: '/account' }), key);
 * decrypt(sealed, key); // { returnTo: '/account' }
 */
export const encrypt = (state: string, key: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, keyOf(key), iv);
  const content = Buffer.concat([cipher.update(state, 'utf8'), cipher.final()]);
  return JSON.stringify({
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex'),
    content: content.toString('hex'),
  });
}

/**
 * Decrypts what `encrypt` made and parses it as JSON. Throws if it isn't valid, was made with
 * another key, or has been altered.
 */
export const decrypt = (encryptedState: string, key: string): unknown => {
  let sealed: { iv?: unknown; tag?: unknown; content?: unknown };
  try {
    sealed = JSON.parse(encryptedState);
  }
  catch (error) {
    throw new Error('Invalid encrypted state format', { cause: error });
  }
  const { iv, tag, content } = sealed ?? {};
  if (typeof iv !== 'string' || typeof tag !== 'string' || typeof content !== 'string') {
    throw new Error('Invalid encrypted state format');
  }

  let decrypted: string;
  try {
    const decipher = createDecipheriv(ALGORITHM, keyOf(key), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]).toString('utf8');
  }
  catch (error) {
    throw new Error('Could not decrypt the state', { cause: error });
  }

  try {
    return JSON.parse(decrypted);
  }
  catch (error) {
    throw new Error('Invalid decrypted state format', { cause: error });
  }
}
