import { defineConfig, devices } from "@playwright/test";

const port = 3000;

export default defineConfig({
  testDir: "./tests/e2e",
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
    command: "pnpm dev",
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      NODE_ENV: "development",
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/nps_choice_platform?schema=public",
      LOG_LEVEL: "debug",
      ADMIN_DEV_USER_ID: "dev-admin-user",
      ADMIN_DEV_ROLE: "admissions_admin",
      ALLOW_DEV_AUTH: "true",
      NPS_DISABLE_EVENT_WRITE: "true",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
