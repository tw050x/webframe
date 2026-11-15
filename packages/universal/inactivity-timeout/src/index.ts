export type InactivityTimeoutOptions = {
  /** Called once the timeout is reached. */
  onTimeout: () => void;
  /** How long nothing has to happen, in milliseconds; 30 s by default. */
  timeoutInMilliseconds?: number;
};

export type InactivityTimeout = {
  /** Starts the timeout; throws if it's already started. */
  start: () => void;
  /** Starts it again from now, as something happened; throws if it isn't started. */
  reset: () => void;
  /** Stops it; throws if it isn't started. */
  clear: () => void;
  /** The timer once started (even after it has run), until it's cleared; else null. */
  readonly id: ReturnType<typeof setTimeout> | null;
};

/** @deprecated Use `InactivityTimeout`. */
export type InactivityTimeoutReturnValue = InactivityTimeout;

/**
 * Creates a timeout that runs `onTimeout` once nothing has happened for a while: call `reset`
 * whenever something does. Works in Node and in browsers.
 *
 * @example
 * const timeout = createInactivityTimeout({ onTimeout: () => socket.end(), timeoutInMilliseconds: 60_000 });
 * socket.on('data', () => timeout.reset());
 * timeout.start();
 */
export const createInactivityTimeout = ({
  onTimeout,
  timeoutInMilliseconds = 30_000,
}: InactivityTimeoutOptions): InactivityTimeout => {
  let id: ReturnType<typeof setTimeout> | null = null;

  const start = () => {
    if (id !== null) throw new Error('Timeout already started');
    // kept once it has run, as before: `reset` starts it again, and `start` needs a `clear` first
    id = setTimeout(onTimeout, timeoutInMilliseconds);
  };

  const clear = () => {
    if (id === null) throw new Error('Timeout already cleared');
    clearTimeout(id);
    id = null;
  };

  const reset = () => {
    clear();
    start();
  };

  return {
    start,
    reset,
    clear,
    get id() { return id; },
  };
};
