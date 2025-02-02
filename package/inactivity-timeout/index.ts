export type InactivityTimeoutOptions = {
  onTimeout: () => void;
  timeoutInMilliseconds?: number;
};

export type InactivityTimeoutReturnValue = {
  clear: () => void;
  id: NodeJS.Timeout | null;
  reset: () => void;
  start: () => void;
};

/**
 * Creates an inactivity timeout for a socket.
 *
 * @param options.onTimeout a handler to call when the timeout is reached
 * @param options.timeoutInMilliseconds the time in milliseconds to wait before ending the socket
 * @returns InactivityTimeoutReturnValue
 */
export const createInactivityTimeout = ({
  onTimeout,
  timeoutInMilliseconds = 30_000,
}: InactivityTimeoutOptions) => {
  const inactivityTimeout: Partial<InactivityTimeoutReturnValue> = {
    id: null,
  };

  const clear = () => {
    if (inactivityTimeout.id === null)
      throw new Error("Timeout already cleared");
    clearTimeout(inactivityTimeout.id);
    inactivityTimeout.id = null;
  };

  const reset = () => {
    if (inactivityTimeout.id === null)
      throw new Error("Timeout already cleared");
    clear();
    start();
  };

  const start = () => {
    if (inactivityTimeout.id === null)
      inactivityTimeout.id = setTimeout(onTimeout, timeoutInMilliseconds);
    else throw new Error("Timeout already started");
  };

  inactivityTimeout.clear = clear;
  inactivityTimeout.reset = reset;
  inactivityTimeout.start = start;

  return inactivityTimeout as InactivityTimeoutReturnValue;
};
