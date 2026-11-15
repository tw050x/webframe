import type { FunctionComponent, ReactNode } from 'react';
import type { ProviderEntry } from './create-provider.js';

export type ProvidersProps = {
  /** The providers, outermost first: made with `createProvider`. */
  providers: readonly ProviderEntry[];
  children?: ReactNode;
};

/**
 * Wraps its children in each of the providers, the first in the list outermost.
 *
 * @example
 * <Providers providers={[createProvider(DataProvider), createProvider(LoggerProvider, { handler: console.info })]}>
 *   <App />
 * </Providers>
 */
export const Providers: FunctionComponent<ProvidersProps> = ({ children, providers }) => {
  return providers.reduceRight<ReactNode>(
    (wrapped, { Component, props = {} }) => <Component {...props}>{wrapped}</Component>,
    children,
  );
};

export default Providers;
