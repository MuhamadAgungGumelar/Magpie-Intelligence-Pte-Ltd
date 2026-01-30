// Trigger.dev Configuration
// https://trigger.dev/docs

import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID || "proj_thamrdhirlwxzrzexewy",
  runtime: "node",
  logLevel: "info",
  maxDuration: 300, // 5 minutes max for sync jobs
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
});
