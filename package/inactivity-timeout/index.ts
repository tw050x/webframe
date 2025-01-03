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
  let id: InactivityTimeoutReturnValue["id"] = null;

  const clear = () => {
    if (id === null) throw new Error("Timeout already cleared");
    clearTimeout(id);
  };

  const reset = () => {
    if (id === null) throw new Error("Timeout already cleared");
    clear();
  };

  const start = () => {
    if (id === null) id = setTimeout(onTimeout, timeoutInMilliseconds);
    else throw new Error("Timeout already started");
  };

  return { clear, id, reset, start };
};
