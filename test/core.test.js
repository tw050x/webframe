import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defineMiddleware } from '@webframe/core';
import { serve } from './helpers.js';

const text = (body) => async ({ serverResponse }) => serverResponse.sendOKTextResponse(body);

test('routes: exact match beats a parameter pattern, and longer patterns come first', async (t) => {
  const { request, close } = await serve({
    'GET /users/me': text('me'),
    'GET /users/:id': text('user'),
    'GET /users/:id/posts/:post': text('post'),
    'post /users': text('created'),
  });
  t.after(close);
  assert.equal(await (await request('/users/me')).text(), 'me');
  assert.equal(await (await request('/users/42')).text(), 'user');
  assert.equal(await (await request('/users/42/posts/7')).text(), 'post');
  assert.equal(await (await request('/users', { method: 'POST' })).text(), 'created');
  const missing = await request('/users/42/other');
  assert.equal(missing.status, 404);
});

test('routes: repeated segments in a pattern are matched by position', async (t) => {
  const { request, close } = await serve({ 'GET /a/:x/a/:y': text('ok') });
  t.after(close);
  assert.equal((await request('/a/1/a/2')).status, 200);
  assert.equal((await request('/a/1/b/2')).status, 404);
});

test('healthcheck answers by default, and 404 can be replaced', async (t) => {
  const { request, close } = await serve({
    'ERROR 404': async ({ serverResponse }) => serverResponse.sendNotFoundJSONResponse(),
  });
  t.after(close);
  assert.equal(await (await request('/healthcheck')).text(), 'Healthy');
  assert.deepEqual(await (await request('/nope')).json(), { message: 'not found' });
});

test('a trailing slash redirects to the path without it, keeping the query', async (t) => {
  const { request, close } = await serve({ 'GET /a': text('a') });
  t.after(close);
  const response = await request('/a/?x=1');
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/a?x=1');
});

test('a trailing slash redirect never leaves the site', async (t) => {
  const { request, close } = await serve({});
  t.after(close);
  const response = await request('//evil.example/');
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/evil.example');
});

test('middleware: each decorates the context, and the chain stops once one responds', async (t) => {
  let reachedAfterSend = false;
  const { request, close } = await serve({
    'GET /chain': defineMiddleware([
      async (context) => { context.user = { name: 'Ada' }; },
      async (context) => context.serverResponse.sendOKJSONResponse(context.user),
      async () => { reachedAfterSend = true; },
    ]),
  });
  t.after(close);
  assert.deepEqual(await (await request('/chain')).json(), { name: 'Ada' });
  assert.equal(reachedAfterSend, false);
});

test('middleware: a 500 when nothing responds or something throws', async (t) => {
  const errors = [];
  const logger = { debug() {}, info() {}, warn() {}, error: (e) => errors.push(e) };
  const { request, close } = await serve({
    'GET /silent': defineMiddleware([async () => {}]),
    'GET /throws': defineMiddleware([async () => { throw new Error('boom'); }]),
    'GET /bare': async () => { throw new Error('bare'); },
  }, { logger });
  t.after(close);
  assert.equal((await request('/silent')).status, 500);
  assert.equal((await request('/throws')).status, 500);
  assert.equal((await request('/bare')).status, 500);
  assert.equal(errors.length, 3);
});

test('a response written without the send methods still ends the chain', async (t) => {
  let after = false;
  const { request, close } = await serve({
    'GET /raw': defineMiddleware([
      async ({ serverResponse }) => { serverResponse.writeHead(418); serverResponse.end(); },
      async () => { after = true; },
    ]),
  });
  t.after(close);
  assert.equal((await request('/raw')).status, 418);
  assert.equal(after, false);
});

test('request bodies: JSON, forms, the limit, and reading twice', async (t) => {
  const { request, close } = await serve({
    'POST /json': async ({ incomingMessage, serverResponse }) => {
      const first = await incomingMessage.useJSONBody();
      const second = await incomingMessage.useJSONBody();
      serverResponse.sendOKJSONResponse({ first, second });
    },
    'POST /form': async ({ incomingMessage, serverResponse }) =>
      serverResponse.sendOKJSONResponse(await incomingMessage.useFormDataBody()),
    'POST /small': async ({ incomingMessage, serverResponse }) =>
      serverResponse.sendOKJSONResponse({ body: await incomingMessage.readBody({ limit: 4 }) }),
  });
  t.after(close);
  const json = await (await request('/json', { method: 'POST', body: '{"a":[1,2]}' })).json();
  assert.deepEqual(json, { first: { a: [1, 2] }, second: { a: [1, 2] } });
  assert.deepEqual(await (await request('/json', { method: 'POST', body: 'nope' })).json(), { first: null, second: null });
  assert.deepEqual(await (await request('/form', { method: 'POST', body: 'city=New+York&x=' })).json(), { city: 'New York', x: '' });
  const small = await request('/small', { method: 'POST', body: '12345678' }).catch(() => null);
  if (small) assert.deepEqual(await small.json(), { body: null });
});

test('URL parameters and query', async (t) => {
  const { request, close } = await serve({
    'GET /orders/:order/items/:item': async ({ incomingMessage, serverResponse }) =>
      serverResponse.sendOKJSONResponse({
        params: incomingMessage.useUrlParams('/orders/:order/items/:item'),
        other: incomingMessage.useUrlParams('/orders/:order'),
        query: incomingMessage.useUrlQuery(),
      }),
  });
  t.after(close);
  const body = await (await request('/orders/4%2056/items/%E2%9C%94?q=a%2541&page=2')).json();
  assert.deepEqual(body, {
    params: { order: '4 56', item: '✔' },
    other: {},
    query: { q: 'a%41', page: '2' },
  });
});

test('redirects to htmx requests use HX-Redirect', async (t) => {
  const { request, close } = await serve({
    'GET /go': async ({ serverResponse }) => serverResponse.sendSeeOtherRedirect('/there'),
  });
  t.after(close);
  const plain = await request('/go');
  assert.equal(plain.status, 303);
  assert.equal(plain.headers.get('location'), '/there');
  const htmx = await request('/go', { headers: { 'HX-Request': 'true' } });
  assert.equal(htmx.headers.get('hx-redirect'), '/there');
  assert.equal(htmx.headers.get('location'), null);
});

test('HTML from a string, a promise and a stream', async (t) => {
  const { Readable } = await import('node:stream');
  const { request, close } = await serve({
    'GET /string': async ({ serverResponse }) => serverResponse.sendOKHTMLResponse('<p>a</p>'),
    'GET /promise': async ({ serverResponse }) => serverResponse.sendOKHTMLResponse(Promise.resolve('<p>b</p>')),
    'GET /stream': async ({ serverResponse }) => serverResponse.sendNotFoundHTMLResponse(Readable.from(['<p>', 'c', '</p>'])),
  });
  t.after(close);
  assert.equal(await (await request('/string')).text(), '<p>a</p>');
  assert.equal(await (await request('/promise')).text(), '<p>b</p>');
  const stream = await request('/stream');
  assert.equal(stream.status, 404);
  assert.equal(stream.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(await stream.text(), '<p>c</p>');
});

test('204 has no body', async (t) => {
  const { request, close } = await serve({
    'GET /none': async ({ serverResponse }) => serverResponse.sendNoContentResponse(),
  });
  t.after(close);
  const response = await request('/none');
  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');
});

test('a route handler that finishes without responding gets a 500', async (t) => {
  const { request, close } = await serve({ 'GET /forgot': async () => {} });
  t.after(close);
  assert.equal((await request('/forgot')).status, 500);
});

test('a chain longer than the typed thirty runs to the end', async (t) => {
  const steps = Array.from({ length: 40 }, () => async (context) => { context.count = (context.count ?? 0) + 1; });
  const { request, close } = await serve({
    'GET /long': defineMiddleware([...steps, async ({ count, serverResponse }) => serverResponse.sendOKJSONResponse({ count })]),
  });
  t.after(close);
  assert.deepEqual(await (await request('/long')).json(), { count: 40 });
});

test("defineMiddleware's generated overloads are up to date", async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['scripts/middleware-types.mjs', '--check']);
});

test("the packages' READMEs are up to date with their docs pages", async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['scripts/readmes.mjs', '--check']);
});
