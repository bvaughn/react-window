import { expect, test, type Page } from "@playwright/test";
import { settle } from "./settle";

const HOST = "http://localhost:3012";

// Verifies that rendered rows cover the region of the table body that is visible (without gaps)
async function getTableState(page: Page, isWindow: boolean) {
  return page.evaluate((isWindow) => {
    const tbody = document.querySelector("tbody")!;
    const tbodyRect = tbody.getBoundingClientRect();
    const scroller = document.querySelector('[data-testid="scroller"]');
    const viewTop = isWindow ? 0 : scroller!.getBoundingClientRect().top;
    const viewBottom = isWindow
      ? document.documentElement.clientHeight
      : viewTop + scroller!.clientHeight;

    const visibleTop = Math.max(tbodyRect.top, viewTop);
    const visibleBottom = Math.min(tbodyRect.bottom, viewBottom);

    const rows = Array.from(
      tbody.querySelectorAll<HTMLElement>("tr[data-index]")
    );
    const rects = rows.map((row) => row.getBoundingClientRect());

    return {
      covered:
        visibleBottom <= visibleTop ||
        (rects.length > 0 &&
          rects[0].top <= visibleTop + 0.5 &&
          rects[rects.length - 1].bottom >= visibleBottom - 0.5),
      headerTop:
        document.querySelector("thead")!.getBoundingClientRect().top - viewTop,
      renderedRows: rows.length,
      // Rows are rendered in order, without gaps between them
      contiguous: rows.every(
        (row, index) =>
          index === 0 ||
          Number(row.dataset.index) ===
            Number(rows[index - 1].dataset.index) + 1
      )
    };
  }, isWindow);
}

async function getRowCenter(page: Page, index: number, isWindow: boolean) {
  return page.evaluate(
    ({ index, isWindow }) => {
      const row = document.querySelector(`tr[data-index="${index}"]`);
      if (!row) return null;
      const rect = row.getBoundingClientRect();
      const scroller = document.querySelector('[data-testid="scroller"]');
      const viewTop = isWindow ? 0 : scroller!.getBoundingClientRect().top;
      const viewHeight = isWindow
        ? document.documentElement.clientHeight
        : scroller!.clientHeight;
      return (rect.top + rect.bottom) / 2 - viewTop - viewHeight / 2;
    },
    { index, isWindow }
  );
}

for (const isWindow of [false, true]) {
  for (const isDynamic of [false, true]) {
    const query = [isWindow && "window", isDynamic && "dynamic"]
      .filter(Boolean)
      .join("&");
    const name = `${isWindow ? "window" : "element"} scroll element, ${isDynamic ? "dynamic" : "fixed"} row heights`;

    test.describe(`headless table (${name})`, () => {
      test("renders the visible rows as the table scrolls", async ({
        page
      }) => {
        await page.goto(`${HOST}/headless-table?${query}`);
        await settle(page);

        for (const offset of [0, 150, 900, 7777, 20_000, 0]) {
          await page.evaluate(
            ({ isWindow, offset }) => {
              if (isWindow) {
                window.scrollTo(0, offset);
              } else {
                document.querySelector('[data-testid="scroller"]')!.scrollTop =
                  offset;
              }
            },
            { isWindow, offset }
          );
          await settle(page);

          const state = await getTableState(page, isWindow);
          expect(state.covered, `offset=${offset}`).toBe(true);
          expect(state.contiguous).toBe(true);
          expect(state.renderedRows).toBeLessThan(40);
          if (!isWindow && offset > 0) {
            // The sticky header stays at the top of the scroll element
            expect(Math.abs(state.headerTop)).toBeLessThanOrEqual(1);
          }
        }
      });

      test("scrollToIndex centers a row", async ({ page }) => {
        await page.goto(`${HOST}/headless-table?${query}`);
        await settle(page);
        await page.getByText("Jump", { exact: true }).click();
        await settle(page);
        await settle(page);

        const center = await getRowCenter(page, 500, isWindow);
        expect(center).not.toBeNull();
        expect(Math.abs(center!)).toBeLessThanOrEqual(1);
        expect((await getTableState(page, isWindow)).covered).toBe(true);
      });
    });
  }
}

test.describe("headless table scroll-padding", () => {
  for (const isWindow of [false, true]) {
    for (const isDynamic of [false, true]) {
      const query = [
        "padding",
        "align=start",
        isWindow && "window",
        isDynamic && "dynamic"
      ]
        .filter(Boolean)
        .join("&");

      test(`aligns rows below the sticky header (${isWindow ? "window" : "element"}, ${isDynamic ? "dynamic" : "fixed"})`, async ({
        page
      }) => {
        await page.goto(`${HOST}/headless-table?${query}`);
        await settle(page);
        await page.getByText("Jump", { exact: true }).click();
        await settle(page);
        await settle(page);

        const { headerBottom, rowTop } = await page.evaluate(() => ({
          headerBottom: document.querySelector("thead")!.getBoundingClientRect()
            .bottom,
          rowTop: document
            .querySelector('tr[data-index="500"]')!
            .getBoundingClientRect().top
        }));
        expect(Math.abs(rowTop - headerBottom)).toBeLessThanOrEqual(1);
      });
    }
  }
});

test.describe("useIsScrolling", () => {
  for (const element of [false, true]) {
    test(`tracks ${element ? "an element" : "the window"} scrolling`, async ({
      page
    }) => {
      await page.goto(
        `${HOST}/list-scroll-element${element ? "?element" : ""}`
      );
      const indicator = page.getByTestId("is-scrolling");
      await expect(indicator).toHaveText("false");

      // Record every value, since scrolling may only last a few frames
      await page.evaluate(() => {
        const element = document.querySelector('[data-testid="is-scrolling"]')!;
        const values: string[] = [];
        new MutationObserver(() => values.push(element.textContent!)).observe(
          element,
          { characterData: true, childList: true, subtree: true }
        );
        (window as unknown as { values: string[] }).values = values;
      });

      // Scroll over several frames (headless Chrome applies wheel events instantly,
      // in which case React batches the start and end of scrolling into a single update)
      await page.evaluate((element) => {
        const target = element
          ? document.querySelector('[data-testid="scroller"]')!
          : window;
        target.scrollTo({ behavior: "smooth", top: 3000 });
      }, element);
      await expect(indicator).toHaveText("false");
      await expect
        .poll(() =>
          page.evaluate(
            () => (window as unknown as { values: string[] }).values
          )
        )
        .toEqual(["true", "false"]);
    });
  }
});
