import { defineConfig, devices } from "@playwright/test";

const viewport = { width: 1000, height: 600 };

export default defineConfig({
  fullyParallel: true,
  globalSetup: "./global-setup.ts",
  workers: process.env.CI ? "100%" : undefined,
  projects: [
    {
      name: "chromium",
      timeout: 10_000,
      use: {
        ...devices["Desktop Chrome"],
        viewport

        // Uncomment to visually debug
        // headless: false,
        // launchOptions: {
        //   slowMo: 500
        // }
      }
    },
    {
      name: "firefox",
      timeout: 10_000,
      use: {
        ...devices["Desktop Firefox"],
        viewport
      }
    },
    {
      // WebKit is the engine behind Safari
      name: "webkit",
      timeout: 10_000,
      use: {
        ...devices["Desktop Safari"],
        viewport
      }
    }
  ]
});
