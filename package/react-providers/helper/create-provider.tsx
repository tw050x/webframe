import { ComponentProps, ComponentType, PropsWithChildren } from "react";

type ComponentHasNoProps<
  TComponent extends ComponentType<ComponentProps<TComponent>>,
> = TComponent extends ComponentType<EmptyObject> ? true : false;

type EmptyObject = Record<string, never>;

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
 *  createProvider(DataProvider),
 *  createProvider(LoggerProvider, { handler: console.log } }),
 * ]
 * ```
 */
function createProvider<
  TComponent extends
    | ComponentType<EmptyObject>
    | ComponentType<PropsWithChildren<EmptyObject>>
    | ComponentType<undefined>,
>(
  Component: TComponent
): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
};

function createProvider<
  TComponent extends ComponentType<ComponentProps<TComponent>>,
>(
  Component: TComponent,
  props: ComponentHasNoProps<TComponent> extends false
    ? ComponentProps<TComponent>
    : EmptyObject | undefined
): {
  Component: TComponent;
  props: ComponentHasNoProps<TComponent> extends false
    ? ComponentProps<TComponent>
    : EmptyObject | undefined;
};

function createProvider<
  TComponent extends ComponentType<ComponentProps<TComponent>>,
>(
  Component: TComponent,
  props: ComponentHasNoProps<TComponent> extends false
    ? ComponentProps<TComponent>
    : EmptyObject | undefined
): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
};

function createProvider<
  TComponent extends ComponentType<Record<string, unknown>>,
>(
  Component: TComponent,
  props?: ComponentProps<TComponent>
): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
} {
  return {
    Component,
    props,
  };
}

export default createProvider;
