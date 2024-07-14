import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { default as createProvider } from "../helper/create-provider";

export type ProvidersProp = Array<ReturnType<typeof createProvider>>;

export interface ProvidersProps {
  children?: ReactNode;
  providers: ProvidersProp;
}

/**
 * Renders the provided children wrapped with the given providers
 *
 * @example
 * You can wrap the App component with an array of providers
 * ```typescript
 * const providers: Array<ReturnType<typeof createProvider>> = [
 *  createComponentWithProps(DataProvider),
 *  createComponentWithProps(LoggerProvider, { handler: console.info }),
 * ]
 *
 * <Providers providers={providers}>
 *  <App />
 * </Providers>
 * ```
 *
 * @prop {ReactNode} children - The children to wrap with the providers
 * @prop {FunctionComponent} providers[number].Component - The provider component
 * @prop {PropsWithChildren} providers[number].props - The props to pass to the provider component
 *
 * @returns {ReactNode}
 */
const Providers: FunctionComponent<PropsWithChildren<ProvidersProps>> = ({
  children,
  providers,
}) => {
  return providers.reduceRight(
    (childrenComponents, { Component, props = {} }) => {
      return <Component {...props}>{childrenComponents}</Component>;
    },
    children
  );
};

export default Providers;
