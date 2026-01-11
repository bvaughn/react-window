import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "chromium",
      timeout: 10_000,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1000, height: 600 }

        // Uncomment to visually debug
        // headless: false,
        // launchOptions: {
        //   slowMo: 500
        // }
      }
    }
  ]
});
