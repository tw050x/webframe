import { defineServer, silentLogger } from '@webframe/core';

/** Starts a server on a free port for the routes, and gives a fetch for it. */
export async function serve(routes, options = {}) {
  const server = defineServer({ port: 0, host: '127.0.0.1', routes, logger: silentLogger, ...options });
  await server.listen();
  const { port } = server.address();
  const request = (path, init = {}) => fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual', ...init });
  return { server, request, close: () => server.close() };
}
