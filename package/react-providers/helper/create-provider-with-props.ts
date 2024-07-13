import { ComponentProps, ComponentType, PropsWithChildren } from "react";

type PropsWithoutChildren<T> = Omit<T, "children">;
type IsEmptyType<T> = keyof T extends never ? true : false;

/**
 * Creates a provider entry to be passed to the `<Providers />` component
 *
 * @note
 * This function allows for the creation of provider components that have a requirement for children
 * to be provided (enforced by typescript). This is useful to avoid using a comment to ignore the
 * typescript error when a provider component requires children to be passed to it.
 *
 * @example
 * ```typescript
 * const providers = [
 *  createProviderWithProps(DataProvider),
 *  createProviderWithProps(LoggerProvider, { handler: console.log } }),
 * ]
 * ```
 *
 * @param {ComponentType<any>} Component - The component to create
 * @param {ComponentProps<T>} props - The props to pass to the component
 *
 * @returns {ProvidersEntry<T>}
 */
function createProviderWithProps<
  T extends ComponentType<PropsWithChildren<ComponentProps<T>>>,
>(
  ...parameters: IsEmptyType<
    PropsWithoutChildren<ComponentProps<T>>
  > extends true
    ? [T]
    : [T, PropsWithoutChildren<ComponentProps<T>>]
) {
  return { Component: parameters[0], props: parameters[1] || {} };
}

export default createProviderWithProps;
