import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    extraHTTPHeaders: bypassSecret
      ? { "x-vercel-protection-bypass": bypassSecret }
      : undefined,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
      },
});
