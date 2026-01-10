import { expect, test } from "@playwright/test";

// High level tests; more nuanced scenarios are covered by unit tests
test.describe("layout-shift", () => {
  test("should not occur for client components", async ({ page }) => {
    await page.goto("http://localhost:3012/");
    await expect(page.getByText("No layout shift")).toBeVisible();
  });

  test("should not occur for server-rendered client components", async ({
    page
  }) => {
    await page.goto("http://localhost:3011/");
    await expect(page.getByText("No layout shift")).toBeVisible();
  });

  test("should not occur for server components", async ({ page }) => {
    await page.goto("http://localhost:3010/");
    await expect(page.getByText("No layout shift")).toBeVisible();
  });
});
