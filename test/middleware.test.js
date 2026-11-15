import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defineMiddleware } from '@webframe/core';
import { useCorsHeaders, isAllowedOrigin, isAllowedHeaders } from '@webframe/use-cors-headers';
import { usePaginationQueryParameters } from '@webframe/use-pagination-query-parameters';
import { useLogRequest } from '@webframe/use-log-request';
import { serve } from './helpers.js';

const done = async ({ serverResponse }) => serverResponse.sendNoContentResponse();

test('cors: echoes an allowed origin, with Vary', async (t) => {
  const { request, close } = await serve({
    'GET /api': defineMiddleware([useCorsHeaders({ allowedOrigins: ['app.example.com'], allowedMethods: ['GET', 'POST'] }), done]),
  });
  t.after(close);
  const allowed = await request('/api', { headers: { Origin: 'https://app.example.com' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://app.example.com');
  assert.equal(allowed.headers.get('access-control-allow-methods'), 'GET, POST');
  assert.equal(allowed.headers.get('vary'), 'Origin');
  const other = await request('/api', { headers: { Origin: 'https://evil.example' } });
  assert.equal(other.headers.get('access-control-allow-origin'), null);
  const malformed = await request('/api', { headers: { Origin: 'null' } });
  assert.equal(malformed.status, 204);
});

test('cors: preflights get the allowed headers; origins can come from a function', async (t) => {
  const { request, close } = await serve({
    'OPTIONS /api': defineMiddleware([
      useCorsHeaders({ allowedOrigins: () => 'a.example, b.example', allowedMethods: '*', allowedHeaders: 'Content-Type, X-Token' }),
      done,
    ]),
  });
  t.after(close);
  const response = await request('/api', {
    method: 'OPTIONS',
    headers: { Origin: 'https://b.example', 'Access-Control-Request-Method': 'POST' },
  });
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://b.example');
  assert.equal(response.headers.get('access-control-allow-headers'), 'content-type, x-token');
  assert.equal(response.headers.get('access-control-allow-methods'), '*');
});

test('cors: bad methods are refused when the middleware is made', () => {
  assert.throws(() => useCorsHeaders({ allowedOrigins: '*', allowedMethods: ['GET', 'FETCH'] }), /FETCH/);
});

test('cors helpers', () => {
  assert.equal(isAllowedOrigin('https://a.example:8443', ['a.example:8443']), true);
  assert.equal(isAllowedOrigin('not a url', ['a.example']), false);
  assert.equal(isAllowedHeaders('Content-Type, X-A', ['content-type', 'x-a']), true);
  assert.equal(isAllowedHeaders('X-B', ['x-a']), false);
});

test('pagination: redirects to add the defaults, then reads them into the context', async (t) => {
  const { request, close } = await serve({
    'GET /list': defineMiddleware([
      usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20, maxPageSize: 50 }),
      async ({ pagination, serverResponse }) => serverResponse.sendOKJSONResponse(pagination),
    ]),
  });
  t.after(close);
  const missing = await request('/list?q=x');
  assert.equal(missing.status, 302);
  assert.equal(missing.headers.get('location'), '/list?q=x&pi=0&ps=20');
  assert.deepEqual(await (await request('/list?pi=3&ps=10')).json(), { pageIndex: 3, pageSize: 10 });
  assert.deepEqual(await (await request('/list?pi=-1&ps=abc')).json(), { pageIndex: 0, pageSize: 20 });
  assert.deepEqual(await (await request('/list?pi=1&ps=500')).json(), { pageIndex: 1, pageSize: 50 });
});

test('pagination: bad defaults are refused when the middleware is made', () => {
  assert.throws(() => usePaginationQueryParameters({ defaultPageIndex: -1, defaultPageSize: 10 }));
  assert.throws(() => usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 0 }));
  assert.throws(() => usePaginationQueryParameters({ defaultPageIndex: 0, defaultPageSize: 20, maxPageSize: 10 }));
});

test('log-request logs to the server logger', async (t) => {
  const lines = [];
  const logger = { debug: (m) => lines.push(m), info() {}, warn() {}, error() {} };
  const { request, close } = await serve({ 'GET /x': defineMiddleware([useLogRequest(), done]) }, { logger });
  t.after(close);
  await request('/x?y=1');
  assert.ok(lines.includes('GET /x?y=1'));
});
