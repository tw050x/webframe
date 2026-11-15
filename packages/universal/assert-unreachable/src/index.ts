/**
 * Marks code that can't be reached, such as the default of a switch over every case: TypeScript
 * reports it if a case is missed, and it throws if it's reached anyway.
 *
 * @example
 * switch (status) {
 *   case 'active': return 'Active';
 *   case 'suspended': return 'Suspended';
 *   default: return assertUnreachable(status, `Unknown status: ${status}`);
 * }
 */
export const assertUnreachable = (_: never, message = 'Unreachable code reached'): never => {
  throw new Error(message);
}

export default assertUnreachable;
