/**
 * Asserts that a value should not of been reached.
 *
 * @param {never} message
 */
export default function assertUnreachable(
  value: never,
  message?: string
): never {
  throw new Error(message);
}
