// Checked by `tsc --build` (never run): a healthcheck from @webframe/healthcheck is the worker's health.
import { defineWorker, defineIntervalSource } from "@webframe/core";
import { defineHealthcheck } from "@webframe/healthcheck";

defineWorker({
  source: defineIntervalSource({ ExpireSessions: 60_000 }),
  jobs: { ExpireSessions: async (_data, { logger }) => { logger.info('expiring'); } },
  health: defineHealthcheck({ filePath: '/healthcheck', checkInterval: 15_000 }),
});
