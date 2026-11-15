import type { ComponentProps, ComponentType, PropsWithChildren, ReactNode } from 'react';

type EmptyObject = Record<string, never>;

type ComponentHasNoProps<TComponent extends ComponentType<ComponentProps<TComponent>>> =
  TComponent extends ComponentType<EmptyObject> ? true : false;

/** A provider and its props, as `<Providers />` takes them. */
export type ProviderEntry<TComponent extends ComponentType<any> = ComponentType<any>> = {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
};

/**
 * Makes an entry for `<Providers />`: the provider and its props, type-checked against it. A
 * provider that needs `children` is fine, as `<Providers />` gives it them.
 *
 * @example
 * const providers = [
 *   createProvider(DataProvider),
 *   createProvider(LoggerProvider, { handler: console.log }),
 * ];
 */
function createProvider<
  TComponent extends
    | ComponentType<EmptyObject>
    | ComponentType<PropsWithChildren<EmptyObject>>
    | ComponentType<{ children: ReactNode }>
    | ComponentType<undefined>,
>(Component: TComponent): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
};

function createProvider<TComponent extends ComponentType<ComponentProps<TComponent>>>(
  Component: TComponent,
  props: ComponentHasNoProps<TComponent> extends false
    ? Omit<ComponentProps<TComponent>, 'children'>
    : EmptyObject | undefined,
): {
  Component: TComponent;
  props: ComponentHasNoProps<TComponent> extends false
    ? ComponentProps<TComponent>
    : EmptyObject | undefined;
};

function createProvider<TComponent extends ComponentType<ComponentProps<TComponent>>>(
  Component: TComponent,
  props: ComponentHasNoProps<TComponent> extends false
    ? ComponentProps<TComponent>
    : EmptyObject | undefined,
): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
};

function createProvider<TComponent extends ComponentType<Record<string, unknown>>>(
  Component: TComponent,
  props?: ComponentProps<TComponent>,
): {
  Component: TComponent;
  props?: ComponentProps<TComponent>;
} {
  return props === undefined ? { Component } : { Component, props };
}

export { createProvider };
export default createProvider;
