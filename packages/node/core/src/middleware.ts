import type { NewPropertiesOnly, RouteHandler, ServiceRequestContext } from "./types.js";

/**
 * A step in a request's handling. It's given the context the steps before it decorated, and may
 * decorate it further (OutputContext says with what), send the response (which ends the chain), or both.
 */
export type Middleware<
  InputContext extends ServiceRequestContext = ServiceRequestContext,
  OutputContext extends ServiceRequestContext = InputContext
> = ((
  context: InputContext & Partial<NewPropertiesOnly<InputContext, OutputContext>>
) => void | Promise<void>) & {
  /**
   * Type-only, never set: the middleware's decorations, where the chain can infer them. They can't be
   * inferred from the parameter's type, which only shows the new properties, as optional.
   */
  readonly [decorations]?: OutputContext;
};

declare const decorations: unique symbol;

/** How many middleware in a chain are typed; any after them still run. */
export const TYPED_CHAIN_LENGTH = 30;

/**
 * How middleware past the typed ones may decorate the context: with anything, untyped.
 */
type Untyped = Record<string, any>;

// <generated: npm run middleware-types>
// One overload for each length of chain up to TYPED_CHAIN_LENGTH, and one for longer chains.
// Each middleware's input is everything the ones before it added; NoInfer keeps TypeScript from
// guessing those from the inputs, so each is inferred from what its middleware says it adds.
export function defineMiddleware<
  T1 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext,
  T27 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26>, T27>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext,
  T27 extends ServiceRequestContext,
  T28 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26>, T27>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27>, T28>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext,
  T27 extends ServiceRequestContext,
  T28 extends ServiceRequestContext,
  T29 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26>, T27>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27>, T28>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28>, T29>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext,
  T27 extends ServiceRequestContext,
  T28 extends ServiceRequestContext,
  T29 extends ServiceRequestContext,
  T30 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26>, T27>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27>, T28>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28>, T29>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28 & T29>, T30>
  ]
): RouteHandler;
export function defineMiddleware<
  T1 extends ServiceRequestContext,
  T2 extends ServiceRequestContext,
  T3 extends ServiceRequestContext,
  T4 extends ServiceRequestContext,
  T5 extends ServiceRequestContext,
  T6 extends ServiceRequestContext,
  T7 extends ServiceRequestContext,
  T8 extends ServiceRequestContext,
  T9 extends ServiceRequestContext,
  T10 extends ServiceRequestContext,
  T11 extends ServiceRequestContext,
  T12 extends ServiceRequestContext,
  T13 extends ServiceRequestContext,
  T14 extends ServiceRequestContext,
  T15 extends ServiceRequestContext,
  T16 extends ServiceRequestContext,
  T17 extends ServiceRequestContext,
  T18 extends ServiceRequestContext,
  T19 extends ServiceRequestContext,
  T20 extends ServiceRequestContext,
  T21 extends ServiceRequestContext,
  T22 extends ServiceRequestContext,
  T23 extends ServiceRequestContext,
  T24 extends ServiceRequestContext,
  T25 extends ServiceRequestContext,
  T26 extends ServiceRequestContext,
  T27 extends ServiceRequestContext,
  T28 extends ServiceRequestContext,
  T29 extends ServiceRequestContext,
  T30 extends ServiceRequestContext
>(
  middlewares: [
    Middleware<ServiceRequestContext, T1>,
    Middleware<ServiceRequestContext & NoInfer<T1>, T2>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2>, T3>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3>, T4>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4>, T5>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5>, T6>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6>, T7>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7>, T8>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>, T9>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>, T10>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>, T11>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11>, T12>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12>, T13>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13>, T14>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14>, T15>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15>, T16>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16>, T17>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17>, T18>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18>, T19>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19>, T20>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20>, T21>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21>, T22>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22>, T23>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23>, T24>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24>, T25>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25>, T26>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26>, T27>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27>, T28>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28>, T29>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28 & T29>, T30>,
    Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28 & T29 & T30> & Untyped>,
    ...Middleware<ServiceRequestContext & NoInfer<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20 & T21 & T22 & T23 & T24 & T25 & T26 & T27 & T28 & T29 & T30> & Untyped>[]
  ]
): RouteHandler;
// </generated>

/**
 * Makes a route from a chain of middleware, run in order, each given the context as the ones
 * before decorated it. The chain stops once one sends a response. If none does, or one throws, a 500
 * is sent and the error logged.
 *
 * @example
 * export default defineMiddleware([
 *   useLogRequest(),
 *   usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20 }),
 *   async (context) => context.serverResponse.sendOKJSONResponse(context.pagination),
 * ]);
 */
export function defineMiddleware(middlewares: Middleware<any, any>[]): RouteHandler {
  return async (context) => {
    try {
      for (const middleware of middlewares) {
        if (context.serverResponse.sendingOrSent) {
          break;
        }
        await middleware(context);
      }
    }
    catch (error) {
      context.logger.error(error);
      if (context.serverResponse.sendingOrSent === false) {
        return void context.serverResponse.sendInternalServerErrorTextResponse();
      }
      return void context.serverResponse.destroy();
    }

    if (context.serverResponse.sendingOrSent === false) {
      context.logger.error('No response sent by the middleware chain; sending 500 Internal Server Error.');
      return void context.serverResponse.sendInternalServerErrorTextResponse();
    }
  };
}
