import { expect, test } from "@playwright/test";

// High level tests; more nuanced scenarios are covered by unit tests
test.describe("layout-shift", () => {
  test("should not occur for client apps", async ({ page }) => {
    await page.goto("http://localhost:3012/");

    const innerHTML = await page.evaluate(() => document.body.innerHTML);
    expect(innerHTML).toContain("<!-- CLIENT MARKER -->");

    await expect(page.getByText("Row count on mount: 10")).toBeVisible();
    await expect(page.getByText("No layout shift")).toBeVisible();
  });

  test("should not occur for server-rendered apps", async ({ page }) => {
    await page.goto("http://localhost:3011/");

    const innerHTML = await page.evaluate(() => document.body.innerHTML);
    expect(innerHTML).toContain("<!-- SERVER MARKER -->");

    await expect(page.getByText("Row count on mount: 10")).toBeVisible();
    await expect(page.getByText("No layout shift")).toBeVisible();
  });

  test("should not occur for apps containing server components", async ({
    page
  }) => {
    await page.goto("http://localhost:3010/");

    const innerHTML = await page.evaluate(() => document.body.innerHTML);
    expect(innerHTML).toContain("<!-- SERVER MARKER -->");

    await expect(page.getByText("Row count on mount: 10")).toBeVisible();
    await expect(page.getByText("No layout shift")).toBeVisible();
  });
});
