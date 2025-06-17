import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
        launchOptions: {
          ignoreDefaultArgs: ["--headless", "--headless=old"],
          args: ["--headless=new"],
          slowMo: 300,
        },
        headless: false,
      },
    },
  ],
});
