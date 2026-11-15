import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import assertUnreachableDefault, { assertUnreachable } from '@webframe/assert-unreachable';
import { assertUnreachable as fromUtils } from '@webframe/utils';
import { createInactivityTimeout } from '@webframe/inactivity-timeout';
import Providers, { createProvider } from '@webframe/react-providers';

test('assert-unreachable: throws with the message, and utils re-exports it', () => {
  assert.throws(() => assertUnreachable(/** @type {never} */ ('x'), 'nope'), { message: 'nope' });
  assert.throws(() => assertUnreachable(/** @type {never} */ ('x')), { message: 'Unreachable code reached' });
  assert.equal(assertUnreachableDefault, assertUnreachable);
  assert.equal(fromUtils, assertUnreachable);
});

test('inactivity-timeout: runs once idle, and reset puts it off', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let fired = 0;
  const timeout = createInactivityTimeout({ onTimeout: () => fired++, timeoutInMilliseconds: 100 });
  assert.equal(timeout.id, null);
  timeout.start();
  assert.notEqual(timeout.id, null);
  assert.throws(() => timeout.start(), /already started/);
  t.mock.timers.tick(60);
  timeout.reset();
  t.mock.timers.tick(60);
  assert.equal(fired, 0);
  t.mock.timers.tick(40);
  assert.equal(fired, 1);
  // after it has run, reset starts it again
  timeout.reset();
  t.mock.timers.tick(100);
  assert.equal(fired, 2);
  timeout.clear();
  assert.equal(timeout.id, null);
  assert.throws(() => timeout.clear(), /already cleared/);
  assert.throws(() => timeout.reset(), /already cleared/);
});

test('inactivity-timeout: waits 30 s by default', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let fired = false;
  createInactivityTimeout({ onTimeout: () => { fired = true; } }).start();
  t.mock.timers.tick(29_999);
  assert.equal(fired, false);
  t.mock.timers.tick(1);
  assert.equal(fired, true);
});

test('react-providers: nests the providers, the first outermost', () => {
  const Outer = ({ children }) => createElement('section', null, children);
  const Labelled = ({ label, children }) => createElement('div', { title: label }, children);
  const html = renderToStaticMarkup(createElement(Providers, {
    providers: [createProvider(Outer), createProvider(Labelled, { label: 'x' })],
  }, createElement('p', null, 'Test')));
  assert.equal(html, '<section><div title="x"><p>Test</p></div></section>');
  assert.equal(renderToStaticMarkup(createElement(Providers, { providers: [] }, 'alone')), 'alone');
});

test('react-providers: createProvider keeps props only when given', () => {
  const C = () => null;
  assert.deepEqual(createProvider(C), { Component: C });
  const props = { handler: console.log };
  assert.deepEqual(createProvider(C, props), { Component: C, props });
});
