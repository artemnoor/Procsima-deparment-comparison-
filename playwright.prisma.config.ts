import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const databaseUrl =
  process.env.NPS_E2E_DATABASE_URL ??
  process.env.NPS_TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5433/nps_choice_platform?schema=public";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /prisma-.*\.spec\.ts/,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node ./node_modules/next/dist/bin/next dev",
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      NODE_ENV: "development",
      DATABASE_URL: databaseUrl,
      LOG_LEVEL: "debug",
      ADMIN_DEV_USER_ID: "dev-admin-user",
      ADMIN_DEV_ROLE: "admissions_admin",
      ALLOW_DEV_AUTH: "true",
      NPS_DISABLE_EVENT_WRITE: "true",
      NPS_PUBLIC_DIRECTION_SOURCE: "prisma",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
