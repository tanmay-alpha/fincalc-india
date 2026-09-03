import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || "3000";
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  timeout: 45000,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      PORT,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "ci-testing-secret-at-least-32-characters-long",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || BASE_URL,
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5432/fincalc_test",
    },
  },
});
