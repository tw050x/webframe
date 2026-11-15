/** Re-exported from `@webframe/assert-unreachable`. */
export { assertUnreachable } from '@webframe/assert-unreachable';

/**
 * Normalises an email address: trimmed, in lower case, without a `+tag`.
 *
 * @example
 * normaliseEmailAddress('  User+news@Mail.com '); // 'user@mail.com'
 */
export const normaliseEmailAddress = (email: string): string => {
  return email.trim().toLowerCase().replace(/\+[^@]*@/, '@');
}

const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

/**
 * Sets a value at a dot path in a JSON string, making the objects on the way as needed.
 *
 * @example
 * updateJSON('{"menu":{}}', 'menu.open', true); // '{"menu":{"open":true}}'
 */
export function updateJSON(jsonString: string, dotPath: string, value: unknown): string {
  const keys = dotPath.split('.');
  if (keys.some((key) => UNSAFE_KEYS.has(key))) {
    throw new Error(`Invalid dot path: ${dotPath}`);
  }

  const root = JSON.parse(jsonString || '{}');
  let focus = root;
  for (const key of keys.slice(0, -1)) {
    if (typeof focus[key] !== 'object' || focus[key] === null) {
      focus[key] = {};
    }
    focus = focus[key];
  }
  focus[keys.at(-1)!] = value;
  return JSON.stringify(root);
}
