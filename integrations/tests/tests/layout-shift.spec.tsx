import { expect, test, type Page } from "@playwright/test";

// High level tests; more nuanced scenarios are covered by unit tests
test.describe("layout-shift", () => {
  async function assertRenderedBy(page: Page, type: "client" | "server") {
    const innerHTML = await page.evaluate(() => document.body.innerHTML);
    expect(innerHTML).toContain(
      type === "client" ? "<!-- CLIENT MARKER -->" : "<!-- SERVER MARKER -->"
    );
  }

  test.describe("client-rendered apps", () => {
    const HOST = "http://localhost:3012";

    test("List", async ({ page }) => {
      await page.goto(`${HOST}/list`);

      await assertRenderedBy(page, "client");

      await expect(page.getByText("Rows/cells on mount: 10")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });

    test("Grid", async ({ page }) => {
      await page.goto(`${HOST}/grid`);

      await assertRenderedBy(page, "client");

      await expect(page.getByText("Rows/cells on mount: 30")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });
  });

  test.describe("server-rendered apps", () => {
    const HOST = "http://localhost:3011";

    test("List", async ({ page }) => {
      await page.goto(`${HOST}/list`);

      await assertRenderedBy(page, "server");

      await expect(page.getByText("Rows/cells on mount: 10")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });

    test("Grid", async ({ page }) => {
      await page.goto(`${HOST}/grid`);

      await assertRenderedBy(page, "server");

      await expect(page.getByText("Rows/cells on mount: 30")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });
  });

  test.describe("server component apps", () => {
    const HOST = "http://localhost:3010";

    test("List", async ({ page }) => {
      await page.goto(`${HOST}/list`);

      await assertRenderedBy(page, "server");

      await expect(page.getByText("Rows/cells on mount: 10")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });

    test("Grid", async ({ page }) => {
      await page.goto(`${HOST}/grid`);

      await assertRenderedBy(page, "server");

      await expect(page.getByText("Rows/cells on mount: 30")).toBeVisible();
      await expect(page.getByText("No layout shift")).toBeVisible();
    });
  });
});
