import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const isHeadless = process.env.PW_HEADLESS === "true";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
  workers: isCI ? 1 : undefined,
  reporter: "html",
  use: {
    video: "on",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "Google Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: {
          width: 1920,
          height: 1080,
        },
        headless: isHeadless,
        launchOptions: {
          slowMo: isCI ? 0 : 300,
          ...(isHeadless ? { args: ["--headless=new"] } : {}),
        },
      },
    },
  ],
});
