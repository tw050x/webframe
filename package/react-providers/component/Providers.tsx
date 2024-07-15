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
 *  createProvider(DataProvider),
 *  createProvider(LoggerProvider, { handler: console.info }),
 * ]
 *
 * <Providers providers={providers}>
 *  <App />
 * </Providers>
 * ```
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The children to wrap with the providers
 * @param {Array<Object>} props.providers - The providers to wrap the children with
 * @param {ComponentType<any>} props.providers[].Component - The provider component
 * @param {PropsWithChildren<any>} props.providers[].props - The props to pass to the provider component
 *
 * @return {ReactNode}
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
