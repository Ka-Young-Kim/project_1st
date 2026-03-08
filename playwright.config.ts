import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run db:reset:e2e && npm run dev:webpack",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: "file:./prisma/e2e.db",
      APP_PASSWORD: "changeme1234",
      SESSION_SECRET: "1234567890abcdef",
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
