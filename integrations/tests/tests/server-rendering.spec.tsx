import { expect, test, type Browser } from "@playwright/test";
import { settle } from "./settle";

// Rows are positioned using CSS transforms, which are not reported as layout shifts;
// so compare server-rendered row positions (before hydration) to the hydrated positions directly
async function getRowBounds(
  browser: Browser,
  url: string,
  { javaScriptEnabled }: { javaScriptEnabled: boolean }
) {
  const context = await browser.newContext({ javaScriptEnabled });
  const page = await context.newPage();

  await page.goto(url);

  if (javaScriptEnabled) {
    // Wait for rows to be measured and re-positioned
    await settle(page, { minFrames: 10 });
  }

  const bounds = await page.evaluate(() => {
    const list = document.querySelector('[role="list"]')!;
    const listTop = list.getBoundingClientRect().top;

    return Array.from(list.querySelectorAll('[role="listitem"]')).map((row) => {
      const { height, top } = row.getBoundingClientRect();

      return { height, top: top - listTop };
    });
  });

  await context.close();

  return bounds;
}

test.describe("server-rendering", () => {
  for (const [name, host] of [
    ["server-rendered app", "http://localhost:3011"],
    ["server component app", "http://localhost:3010"]
  ]) {
    test(`dynamic row heights should not move after hydration (${name})`, async ({
      browser
    }) => {
      const serverBounds = await getRowBounds(browser, `${host}/list-dynamic`, {
        javaScriptEnabled: false
      });
      const hydratedBounds = await getRowBounds(
        browser,
        `${host}/list-dynamic`,
        { javaScriptEnabled: true }
      );

      expect(serverBounds.length).toBeGreaterThan(0);

      // Compare the rows that were server rendered
      expect(hydratedBounds.slice(0, serverBounds.length)).toEqual(
        serverBounds
      );
    });
  }
});
