// Checked by `tsc --build` (never run): each middleware sees what the ones before it added.
import { defineMiddleware, type Middleware, type ServiceRequestContext } from "@webframe/core";
import { usePaginationQueryParameters } from "@webframe/use-pagination-query-parameters";
import { useCorsHeaders } from "@webframe/use-cors-headers";

type WithUser = ServiceRequestContext & { user: { name: string } };

const useUser: Middleware<ServiceRequestContext, WithUser> = async (context) => {
  context.user = { name: 'Ada' };
};

defineMiddleware([
  useCorsHeaders({ allowedOrigins: '*', allowedMethods: ['GET'] }),
  useUser,
  usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20 }),
  async (context) => {
    const name: string = context.user.name;
    const size: number = context.pagination.pageSize;
    context.serverResponse.sendOKJSONResponse({ name, size });
  },
]);

defineMiddleware([
  async (context) => {
    // @ts-expect-error nothing before this added a user
    context.user.name;
  },
]);

defineMiddleware([
  useUser,
  async (context) => {
    // @ts-expect-error user.name is a string
    const n: number = context.user.name;
  },
]);

// The guide's example: middleware that needs what another adds only fits after it.
type WithRoles = ServiceRequestContext & { user: { name: string; roles: string[] } };
const useRolesUser: Middleware<ServiceRequestContext, WithRoles> = async (context) => {
  context.user = { name: 'Ada', roles: ['admin'] };
};
const useRequireRole = (role: string): Middleware<WithRoles> => async (context) => {
  if (context.user.roles.includes(role) === false) {
    return context.serverResponse.sendForbiddenTextResponse();
  }
};

defineMiddleware([useRolesUser, useRequireRole('admin'), async ({ serverResponse }) => serverResponse.sendOKTextResponse()]);

defineMiddleware([
  // @ts-expect-error useRequireRole needs the user, which nothing has added yet
  useRequireRole('admin'),
  useRolesUser,
]);

// Thirty are typed: the last of thirty still sees what the first added.
const pass: Middleware = async () => {};
defineMiddleware([
  useUser,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  async (context) => {
    const name: string = context.user.name;
    context.serverResponse.sendOKTextResponse(name);
  },
]);

// A mistake in a chain of thirty is still caught: it can't fall back to the long chains' overload.
defineMiddleware([
  useUser,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  async (context) => {
    // @ts-expect-error user.name is a string
    const n: number = context.user.name;
  },
]);

// Longer chains compile: past thirty, middleware see what the first thirty added, and anything
// they add is untyped.
defineMiddleware([
  useUser,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass, pass,
  async (context) => {
    const name: string = context.user.name;
    context.extra = 1;
  },
  async (context) => {
    context.serverResponse.sendOKJSONResponse({ name: context.user.name, extra: context.extra });
  },
]);
