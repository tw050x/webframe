import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineFileStore } from '@webframe/config';
import { encrypt, decrypt, generateKey } from '@webframe/encrypt';
import { defineHealthcheck } from '@webframe/healthcheck';
import { assertUnreachable, normaliseEmailAddress, updateJSON } from '@webframe/utils';
import { createLogger } from '@webframe/logger';

const tempDir = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'webframe-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};

test('config: reads trimmed files, caches them, and stays inside its directory', (t) => {
  const dir = tempDir(t);
  writeFileSync(join(dir, 'logs.level'), ' debug\n');
  const store = defineFileStore({ directory: dir });
  assert.equal(store.read('logs.level'), 'debug');
  writeFileSync(join(dir, 'logs.level'), 'info');
  assert.equal(store.read('logs.level'), 'debug');
  store.clear();
  assert.equal(store.read('logs.level'), 'info');
  assert.equal(store.exists('missing'), false);
  assert.equal(store.readOr('missing', null), null);
  assert.throws(() => store.read('missing'), /File not found/);
  assert.throws(() => store.read('../etc/passwd'), /Invalid key/);
  assert.throws(() => store.read('/etc/passwd'), /Invalid key/);
});

test('config: a ttl of 0 reads every time', (t) => {
  const dir = tempDir(t);
  const store = defineFileStore({ directory: dir, ttl: 0 });
  writeFileSync(join(dir, 'k'), 'a');
  assert.equal(store.read('k'), 'a');
  writeFileSync(join(dir, 'k'), 'b');
  assert.equal(store.read('k'), 'b');
});

test('encrypt: round trips, and refuses another key or an altered value', () => {
  const key = generateKey();
  const sealed = encrypt(JSON.stringify({ returnTo: '/account' }), key);
  assert.deepEqual(decrypt(sealed, key), { returnTo: '/account' });
  assert.notEqual(encrypt('"x"', key), encrypt('"x"', key));
  assert.throws(() => decrypt(sealed, generateKey()), /Could not decrypt/);
  const altered = JSON.parse(sealed);
  altered.content = altered.content.replace(/^./, (c) => (c === '0' ? '1' : '0'));
  assert.throws(() => decrypt(JSON.stringify(altered), key), /Could not decrypt/);
  assert.throws(() => decrypt('nope', key), /format/);
  assert.throws(() => encrypt('x', 'abcd'), /32 bytes/);
});

test('healthcheck: healthy until an error', (t) => {
  const file = join(tempDir(t), 'health');
  const health = defineHealthcheck({ filePath: file, checkInterval: 1000 });
  t.after(() => health.stop());
  assert.equal(health.read(), 'healthy');
  health.error();
  assert.equal(readFileSync(file, 'utf8'), 'unhealthy');
  writeFileSync(file, 'garbage');
  assert.throws(() => health.read(), /Invalid/);
});

test('utils', () => {
  assert.equal(normaliseEmailAddress('  User+news@Mail.com '), 'user@mail.com');
  assert.equal(updateJSON('{"menu":{}}', 'menu.open', true), '{"menu":{"open":true}}');
  assert.equal(updateJSON('', 'a.b.c', 1), '{"a":{"b":{"c":1}}}');
  assert.throws(() => updateJSON('{}', '__proto__.polluted', true));
  assert.throws(() => assertUnreachable('x', 'nope'), /nope/);
});

test('logger: fits the core Logger and can be silent', () => {
  const logger = createLogger({ console: false });
  logger.info('nothing to write to');
  assert.equal(logger.silent, true);
});
