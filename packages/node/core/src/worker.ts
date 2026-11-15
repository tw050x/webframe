import { defaultLogger, type Logger } from "./logger.js";

/** A job, as a source delivers it. */
export type Job = {
  /** Which handler runs it. */
  name: string;
  /** What it's given: from outside the program, so check its shape before using it. */
  data: unknown;
  /** The source's id for it, for logs. */
  id?: string;
}

export type JobContext = {
  job: Job;
  logger: Logger;
}

/** Runs a job. Resolving means it's done; throwing means it failed, and the source decides whether to retry. */
export type JobHandler = (data: unknown, context: JobContext) => void | Promise<void>;

/** What a source is given when the worker starts it. */
export type SourceControls = {
  /**
   * Runs a job. Resolves once it's done; rejects if it failed: its name has no handler
   * (`UnknownJobError`), its handler threw, or the worker is stopping (`WorkerStoppingError`:
   * give the job back to the queue).
   */
  handle(job: Job): Promise<void>;
  /** Reports an error the source can't recover from, such as a lost connection: the worker stops, unhealthy. */
  fail(error: unknown): void;
  logger: Logger;
}

/**
 * Where jobs come from: a queue, a timer, anything. The worker starts it, and it calls `handle`
 * for each job; the worker stops it before shutting down, and it must then stop delivering.
 */
export interface JobSource {
  start(controls: SourceControls): void | Promise<void>;
  stop(): void | Promise<void>;
}

/**
 * The worker's health, as it reports it: what `defineHealthcheck` from `@webframe/healthcheck` gives.
 */
export interface WorkerHealth {
  /** Marks the worker unhealthy for good. */
  error(): void;
  /** Stops reporting, as the worker shuts down. */
  stop(): void;
}

export type WorkerOptions = {
  /** Where jobs come from: one source, or several (a timer and a queue, say) sharing the same handlers. */
  source: JobSource | readonly JobSource[];
  /** A handler for each job, by name. */
  jobs: Record<string, JobHandler>;
  /** Where to log; the console without debug lines by default. */
  logger?: Logger;
  /** How many jobs run at once; 1 by default. */
  concurrency?: number;
  /** Where to report the worker's health, such as `defineHealthcheck(…)`; marked unhealthy on a fatal error. */
  health?: WorkerHealth;
  /** How long stopping waits for running jobs, in milliseconds; 30 s by default. */
  shutdownTimeout?: number;
  /** Stop gracefully on SIGINT and SIGTERM; true by default. */
  handleSignals?: boolean;
  /** End the process once stopped by a signal (code 0) or a fatal error (code 1); true by default. */
  exitProcess?: boolean;
}

export type Worker = {
  /** Starts the source. */
  start(): Promise<void>;
  /** Stops taking jobs and waits for running ones (up to the shutdown timeout). */
  stop(): Promise<void>;
  /** Stops for an error it can't recover from: logged, marked unhealthy, and the process ends with code 1. */
  fail(error: unknown): Promise<void>;
  /** How many jobs are running. */
  readonly running: number;
}

/** A job refused because the worker is stopping; the source should give it back to its queue. */
export class WorkerStoppingError extends Error {
  constructor(job: Job) {
    super(`The worker is stopping; job ${job.name} wasn't run`);
    this.name = 'WorkerStoppingError';
  }
}

/** A job whose name has no handler. */
export class UnknownJobError extends Error {
  constructor(job: Job) {
    super(`Unknown job: ${job.name}`);
    this.name = 'UnknownJobError';
  }
}

const describe = (job: Job) => job.id === undefined ? job.name : `${job.name} (${job.id})`;

/**
 * Defines a worker: jobs from one or more sources run by their handlers, a few at a time, with a graceful
 * shutdown. It doesn't depend on any queue: a source delivers the jobs.
 *
 * @example
 * const worker = defineWorker({
 *   source,
 *   jobs: {
 *     ExpireSessions: async () => { … },
 *     SessionActivity: async (data, { logger }) => { … },
 *   },
 *   health: defineHealthcheck({ filePath: '/healthcheck', checkInterval: 15_000 }),
 * });
 * await worker.start();
 */
export function defineWorker(options: WorkerOptions): Worker {
  const logger = options.logger ?? defaultLogger;
  const concurrency = options.concurrency ?? 1;
  const shutdownTimeout = options.shutdownTimeout ?? 30_000;
  const handleSignals = options.handleSignals ?? true;
  const exitProcess = options.exitProcess ?? true;
  const sources: readonly JobSource[] = Array.isArray(options.source) ? options.source : [options.source as JobSource];
  const started: JobSource[] = [];

  if (Number.isInteger(concurrency) === false || concurrency < 1) {
    throw new TypeError('concurrency must be a whole number, 1 or more');
  }

  let state: 'idle' | 'running' | 'stopping' | 'stopped' = 'idle';
  let stopping: Promise<void> | undefined;
  const inFlight = new Set<Promise<unknown>>();

  // at most `concurrency` jobs at once; the rest wait their turn
  let active = 0;
  const waiting: Array<() => void> = [];
  const acquire = () => new Promise<void>((resolve) => {
    if (active < concurrency) {
      active++;
      resolve();
    }
    else {
      waiting.push(resolve);
    }
  });
  const release = () => {
    const next = waiting.shift();
    if (next) next();
    else active--;
  };

  const run = async (job: Job) => {
    await acquire();
    try {
      // a job that waited its turn while the worker began stopping goes back to the source
      if (state !== 'running') {
        throw new WorkerStoppingError(job);
      }
      logger.debug(`Job ${describe(job)} started`);
      await options.jobs[job.name]!(job.data, { job, logger });
      logger.debug(`Job ${describe(job)} done`);
    }
    catch (error) {
      if (error instanceof WorkerStoppingError === false) {
        logger.error(`Job ${describe(job)} failed`);
        logger.error(error);
      }
      throw error;
    }
    finally {
      release();
    }
  };

  const handle = (job: Job): Promise<void> => {
    if (state !== 'running') {
      return Promise.reject(new WorkerStoppingError(job));
    }
    if (Object.hasOwn(options.jobs, job.name) === false) {
      const error = new UnknownJobError(job);
      logger.error(error.message);
      return Promise.reject(error);
    }
    const result = run(job);
    const settled = result.catch(() => {});
    inFlight.add(settled);
    void settled.then(() => inFlight.delete(settled));
    return result;
  };

  const onSignal = (signal: NodeJS.Signals) => {
    if (state === 'stopping') {
      logger.warn(`Received ${signal} again; stopping now.`);
      if (exitProcess) process.exit(1);
      return;
    }
    logger.info(`Received ${signal}; stopping gracefully...`);
    void stop().then(() => {
      if (exitProcess) process.exit(0);
    });
  };

  const removeSignals = () => {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
  };

  const stop = (): Promise<void> => {
    if (state === 'idle') {
      state = 'stopped';
      return Promise.resolve();
    }
    stopping ??= (async () => {
      state = 'stopping';
      // stop every source that started, so no new jobs arrive
      await Promise.all(started.map(async (source) => {
        try {
          await source.stop();
        }
        catch (error) {
          logger.error(error);
        }
      }));

      if (inFlight.size > 0) {
        logger.info(`Waiting for ${inFlight.size} job(s) to finish...`);
        let timer: NodeJS.Timeout | undefined;
        const timedOut = new Promise<'timeout'>((resolve) => {
          timer = setTimeout(() => resolve('timeout'), shutdownTimeout);
        });
        const result = await Promise.race([Promise.all(inFlight).then(() => 'done' as const), timedOut]);
        clearTimeout(timer);
        if (result === 'timeout') {
          logger.warn(`Stopped with ${inFlight.size} job(s) still running after ${shutdownTimeout} ms.`);
        }
      }

      options.health?.stop();
      removeSignals();
      state = 'stopped';
      logger.info('Worker stopped.');
    })();
    return stopping;
  };

  const fail = async (error: unknown) => {
    logger.error(error);
    logger.error('The worker hit an error it can\'t recover from; stopping.');
    options.health?.error();
    await stop();
    if (exitProcess) process.exit(1);
  };

  const start = async () => {
    if (state !== 'idle') {
      throw new Error('The worker has already been started');
    }
    state = 'running';
    if (handleSignals) {
      process.on('SIGINT', onSignal);
      process.on('SIGTERM', onSignal);
    }
    try {
      for (const source of sources) {
        started.push(source);
        await source.start({ handle, fail: (error) => void fail(error), logger });
      }
    }
    catch (error) {
      await fail(error);
      return;
    }
    logger.info(`Worker started: ${Object.keys(options.jobs).join(', ') || 'no jobs'}.`);
  };

  return Object.freeze({
    start,
    stop,
    fail,
    get running() { return active; },
  });
}

/**
 * A queue held in memory: jobs added are run by the worker, in order. For tests, and for work a
 * service hands itself; jobs are lost if the process ends, and a failed job isn't retried.
 */
export type MemorySource = JobSource & {
  /** Adds a job; resolves once it's done, rejects if it failed. Jobs added before the worker starts wait for it. */
  add(name: string, data?: unknown): Promise<void>;
  /** How many jobs are waiting to be delivered. */
  readonly size: number;
}

export function defineMemorySource(): MemorySource {
  type Entry = { job: Job; resolve: () => void; reject: (error: unknown) => void };
  const pending: Entry[] = [];
  let controls: SourceControls | null = null;
  let ids = 0;

  const deliver = (entry: Entry) => {
    controls!.handle(entry.job).then(entry.resolve, (error) => {
      // refused while stopping: keep it for the next start
      if (error instanceof WorkerStoppingError) pending.push(entry);
      else entry.reject(error);
    });
  };

  return {
    add: (name, data) => new Promise<void>((resolve, reject) => {
      const entry = { job: { name, data, id: String(++ids) }, resolve, reject };
      if (controls) deliver(entry);
      else pending.push(entry);
    }),
    get size() { return pending.length; },
    start(c) {
      controls = c;
      pending.splice(0).forEach(deliver);
    },
    stop() {
      controls = null;
    },
  };
}

/** How often each job runs: milliseconds, or with data and whether to run once at start. */
export type IntervalSchedule = Record<string, number | { every: number; data?: unknown; immediately?: boolean }>;

/**
 * Runs jobs on a timer, such as clearing out expired sessions every minute. A job still running
 * when its next turn comes is skipped that turn, so it never overlaps itself.
 *
 * @example
 * defineWorker({
 *   source: defineIntervalSource({ ExpireSessions: 60_000 }),
 *   jobs: { ExpireSessions: async () => sessions.expire() },
 * });
 */
export function defineIntervalSource(schedule: IntervalSchedule): JobSource {
  const timers: NodeJS.Timeout[] = [];

  return {
    start(controls) {
      for (const [name, entry] of Object.entries(schedule)) {
        const { every, data, immediately } = typeof entry === 'number' ? { every: entry, data: undefined, immediately: false } : entry;
        if (Number.isFinite(every) === false || every <= 0) {
          throw new TypeError(`Invalid interval for ${name}: ${every}`);
        }
        let busy = false;
        const tick = () => {
          if (busy) {
            controls.logger.warn(`Job ${name} is still running; skipping this turn.`);
            return;
          }
          busy = true;
          controls.handle({ name, data }).catch(() => {}).finally(() => { busy = false; });
        };
        timers.push(setInterval(tick, every));
        if (immediately) tick();
      }
    },
    stop() {
      timers.splice(0).forEach(clearInterval);
    },
  };
}
