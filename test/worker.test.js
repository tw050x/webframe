import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineWorker, defineMemorySource, defineIntervalSource, silentLogger, UnknownJobError } from '@webframe/core';
import { defineHealthcheck } from '@webframe/healthcheck';

const quiet = { logger: silentLogger, handleSignals: false, exitProcess: false };
const later = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('runs jobs by name, with their data', async (t) => {
  const seen = [];
  const source = defineMemorySource();
  const worker = defineWorker({ ...quiet, source, jobs: {
    Greet: async (data, { job }) => { seen.push([job.name, data]); },
  } });
  t.after(() => worker.stop());
  const added = source.add('Greet', { to: 'Ada' }); // before start: waits for it
  await worker.start();
  await added;
  assert.deepEqual(seen, [['Greet', { to: 'Ada' }]]);
});

test('an unknown job or a throwing handler fails that job, not the worker', async (t) => {
  const source = defineMemorySource();
  const worker = defineWorker({ ...quiet, source, jobs: {
    Boom: async () => { throw new Error('boom'); },
    Fine: async () => {},
  } });
  t.after(() => worker.stop());
  await worker.start();
  await assert.rejects(source.add('Nope'), UnknownJobError);
  await assert.rejects(source.add('Boom'), /boom/);
  await source.add('Fine');
});

test('runs at most `concurrency` jobs at once', async (t) => {
  let now = 0, most = 0;
  const source = defineMemorySource();
  const worker = defineWorker({ ...quiet, source, concurrency: 2, jobs: {
    Slow: async () => { now++; most = Math.max(most, now); await later(20); now--; },
  } });
  t.after(() => worker.stop());
  await worker.start();
  await Promise.all(Array.from({ length: 6 }, () => source.add('Slow')));
  assert.equal(most, 2);
});

test('stopping waits for running jobs, and keeps waiting ones for the next start', async () => {
  const order = [];
  const source = defineMemorySource();
  const worker = defineWorker({ ...quiet, source, jobs: {
    Slow: async (n) => { order.push(`start ${n}`); await later(30); order.push(`end ${n}`); },
  } });
  await worker.start();
  void source.add('Slow', 1);
  void source.add('Slow', 2);
  await later(5);
  await worker.stop();
  assert.deepEqual(order, ['start 1', 'end 1']);
  assert.equal(source.size, 1);
});

test('stopping gives up on jobs after the shutdown timeout', async () => {
  const source = defineMemorySource();
  const worker = defineWorker({ ...quiet, source, shutdownTimeout: 20, jobs: { Stuck: () => new Promise(() => {}) } });
  await worker.start();
  void source.add('Stuck');
  await later(5);
  const started = Date.now();
  await worker.stop();
  assert.ok(Date.now() - started < 500);
});

test('a fatal error from the source marks the worker unhealthy and stops it', async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'webframe-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, 'health');
  let controls;
  let stopped = false;
  const source = { start(c) { controls = c; }, stop() { stopped = true; } };
  const worker = defineWorker({ ...quiet, source, jobs: {}, health: defineHealthcheck({ filePath: file, checkInterval: 1000 }) });
  await worker.start();
  assert.equal(readFileSync(file, 'utf8'), 'healthy');
  controls.fail(new Error('connection lost'));
  await later(10);
  assert.equal(stopped, true);
  assert.equal(readFileSync(file, 'utf8'), 'unhealthy');
});

test('the interval source runs jobs on a timer, never overlapping', async () => {
  let runs = 0, overlapping = false, busy = false;
  const worker = defineWorker({ ...quiet, source: defineIntervalSource({ Tick: { every: 10, immediately: true } }), jobs: {
    Tick: async () => { if (busy) overlapping = true; busy = true; runs++; await later(25); busy = false; },
  } });
  await worker.start();
  await later(80);
  await worker.stop();
  assert.ok(runs >= 2 && runs <= 4, `ran ${runs} times`);
  assert.equal(overlapping, false);
});

test('bad options are refused when the worker is defined', () => {
  assert.throws(() => defineWorker({ ...quiet, source: defineMemorySource(), jobs: {}, concurrency: 0 }));
});

test('one worker takes jobs from several sources, with the same handlers', async () => {
  const seen = [];
  const queue = defineMemorySource();
  const worker = defineWorker({
    ...quiet,
    source: [defineIntervalSource({ Expire: { every: 1000, immediately: true } }), queue],
    jobs: {
      Expire: async () => { seen.push('Expire'); },
      Activity: async (data) => { seen.push(`Activity ${data}`); },
    },
  });
  await worker.start();
  await queue.add('Activity', 7);
  await worker.stop();
  assert.deepEqual(seen.sort(), ['Activity 7', 'Expire']);
});

test('if a source fails to start, the ones already started are stopped', async () => {
  let firstStopped = false;
  const first = { start() {}, stop() { firstStopped = true; } };
  const broken = { start() { throw new Error('no connection'); }, stop() {} };
  const worker = defineWorker({ ...quiet, source: [first, broken], jobs: {} });
  await worker.start();
  assert.equal(firstStopped, true);
});
