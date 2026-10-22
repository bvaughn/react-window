import { expect, test, type Page } from "@playwright/test";
import { settle } from "./settle";

const HOST = "http://localhost:3012";

// Verifies that rendered rows cover the region of the list that is visible within the viewport (without gaps)
async function getListCoverage(page: Page, scrollerSelector?: string) {
  return page.evaluate((scrollerSelector) => {
    const list = document.querySelector<HTMLElement>('[role="list"]')!;
    const listRect = list.getBoundingClientRect();
    const scroller = scrollerSelector
      ? document.querySelector<HTMLElement>(scrollerSelector)!
      : null;
    const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
    const viewBottom = scroller
      ? viewTop + scroller.clientHeight
      : document.documentElement.clientHeight;

    const visibleTop = Math.max(listRect.top, viewTop);
    const visibleBottom = Math.min(listRect.bottom, viewBottom);

    const rects = Array.from(list.querySelectorAll("[data-index]"))
      .map((row) => row.getBoundingClientRect())
      .sort((a, b) => a.top - b.top);

    let gaps = 0;
    for (let i = 1; i < rects.length; i++) {
      if (rects[i].top - rects[i - 1].bottom > 0.5) gaps++;
    }

    return {
      covered:
        visibleBottom <= visibleTop ||
        (rects.length > 0 &&
          rects[0].top <= visibleTop + 0.5 &&
          rects[rects.length - 1].bottom >= visibleBottom - 0.5 &&
          gaps === 0),
      listScrolls: list.scrollHeight > list.clientHeight + 1,
      renderedRows: rects.length
    };
  }, scrollerSelector);
}

// Smooth scrolling takes a variable amount of time;
// wait until the target row has rendered and the scroll position stops changing
async function waitForScrollEnd(
  page: Page,
  index: number,
  scrollerSelector?: string
) {
  const read = () =>
    page.evaluate(
      ({ index, scrollerSelector }) => ({
        position: scrollerSelector
          ? document.querySelector(scrollerSelector)!.scrollTop
          : window.scrollY,
        rendered: document.querySelector(`[data-index="${index}"]`) !== null
      }),
      { index, scrollerSelector }
    );

  await expect
    .poll(async () => {
      const before = await read();
      await settle(page);
      const after = await read();
      return after.rendered && after.position === before.position;
    })
    .toBe(true);
}

async function getRowTop(page: Page, index: number, scrollerSelector?: string) {
  return page.evaluate(
    ({ index, scrollerSelector }) => {
      const row = document.querySelector(`[data-index="${index}"]`);
      if (!row) return null;
      const viewTop = scrollerSelector
        ? document.querySelector(scrollerSelector)!.getBoundingClientRect().top
        : 0;
      return row.getBoundingClientRect().top - viewTop;
    },
    { index, scrollerSelector }
  );
}

test.describe("List with window scrollElement", () => {
  test("renders the rows visible within the window as the page scrolls", async ({
    page
  }) => {
    await page.goto(`${HOST}/list-scroll-element`);
    await settle(page);

    // The list starts 300px down the page; only the rows within the viewport are rendered
    let coverage = await getListCoverage(page);
    expect(coverage.covered).toBe(true);
    expect(coverage.listScrolls).toBe(false);
    expect(coverage.renderedRows).toBeLessThan(15);

    for (const y of [150, 300, 1234, 5000, 14_000, 15_100, 0]) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await settle(page);
      coverage = await getListCoverage(page);
      expect(coverage.covered, `scrollY=${y}`).toBe(true);
      expect(coverage.renderedRows).toBeLessThan(25);
    }
  });

  test("renders correctly while scrolling with the mouse wheel", async ({
    page
  }) => {
    await page.goto(`${HOST}/list-scroll-element`);
    await page.mouse.move(500, 300);
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 400);
      await settle(page);
      expect((await getListCoverage(page)).covered).toBe(true);
    }
  });

  for (const align of ["start", "center", "end"] as const) {
    test(`scrollToRow scrolls the window (align ${align})`, async ({
      page
    }) => {
      await page.goto(`${HOST}/list-scroll-element?align=${align}&index=250`);
      await page.getByText("Jump", { exact: true }).click();
      await waitForScrollEnd(page, 250);

      const top = await getRowTop(page, 250);
      expect(top).not.toBeNull();
      if (align === "start") expect(Math.abs(top!)).toBeLessThanOrEqual(1);
      if (align === "center")
        expect(Math.abs(top! + 15 - 300)).toBeLessThanOrEqual(1);
      if (align === "end")
        expect(Math.abs(top! + 30 - 600)).toBeLessThanOrEqual(1);
      expect((await getListCoverage(page)).covered).toBe(true);
    });
  }

  for (const align of ["start", "center", "end"] as const) {
    test(`scrollToRow corrects dynamic row heights (align ${align})`, async ({
      page
    }) => {
      await page.goto(
        `${HOST}/list-scroll-element?dynamic&align=${align}&index=250`
      );
      await page.getByText("Jump", { exact: true }).click();
      await settle(page);
      await settle(page);

      const rect = await page.evaluate(() =>
        document
          .querySelector('[data-index="250"]')
          ?.getBoundingClientRect()
          .toJSON()
      );
      expect(rect).toBeDefined();
      if (align === "start") expect(Math.abs(rect.top)).toBeLessThanOrEqual(1);
      if (align === "center")
        expect(
          Math.abs((rect.top + rect.bottom) / 2 - 300)
        ).toBeLessThanOrEqual(1);
      if (align === "end")
        expect(Math.abs(rect.bottom - 600)).toBeLessThanOrEqual(1);
      expect((await getListCoverage(page)).covered).toBe(true);
    });
  }

  test("scrolls through dynamic row heights without gaps", async ({ page }) => {
    await page.goto(`${HOST}/list-scroll-element?dynamic`);
    await page.mouse.move(500, 300);
    for (let i = 0; i < 15; i++) {
      await page.mouse.wheel(0, 700);
      await settle(page);
      expect((await getListCoverage(page)).covered, `step ${i}`).toBe(true);
    }
  });

  test("sticky children stick to the top of the page", async ({ page }) => {
    await page.goto(`${HOST}/list-scroll-element?sticky`);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await settle(page);
    const top = await page.evaluate(
      () =>
        document
          .querySelector('[data-testid="sticky"]')!
          .getBoundingClientRect().top
    );
    expect(Math.abs(top)).toBeLessThanOrEqual(1);
  });
});

test.describe("List with HTMLElement scrollElement", () => {
  test("renders the rows visible within the scroll element", async ({
    page
  }) => {
    await page.goto(`${HOST}/list-scroll-element?element`);
    await settle(page);
    const scroller = '[data-testid="scroller"]';

    // The page itself doesn't scroll the list
    await page.evaluate(() => window.scrollTo(0, 100));

    for (const y of [0, 250, 1000, 7777, 15_000]) {
      await page.evaluate(
        ({ scroller, y }) => {
          document.querySelector(scroller)!.scrollTop = y;
        },
        { scroller, y }
      );
      await settle(page);
      const coverage = await getListCoverage(page, scroller);
      expect(coverage.covered, `scrollTop=${y}`).toBe(true);
      expect(coverage.renderedRows).toBeLessThan(20);
    }
  });

  test("scrollToRow scrolls the scroll element", async ({ page }) => {
    await page.goto(`${HOST}/list-scroll-element?element&align=start`);
    await settle(page);
    await page.getByText("Jump", { exact: true }).click();
    await waitForScrollEnd(page, 250, '[data-testid="scroller"]');
    const top = await getRowTop(page, 250, '[data-testid="scroller"]');
    expect(top).not.toBeNull();
    expect(Math.abs(top!)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});

async function getGridState(page: Page) {
  return page.evaluate(() => {
    const grid = document.querySelector<HTMLElement>('[role="grid"]')!;
    const gridRect = grid.getBoundingClientRect();
    const viewRight = document.documentElement.clientWidth;
    const viewBottom = document.documentElement.clientHeight;

    // Region of the grid's client area that is visible within the viewport
    const left = Math.max(gridRect.left + grid.clientLeft, 0);
    const right = Math.min(
      gridRect.left + grid.clientLeft + grid.clientWidth,
      viewRight
    );
    const top = Math.max(gridRect.top + grid.clientTop, 0);
    const bottom = Math.min(
      gridRect.top + grid.clientTop + grid.clientHeight,
      viewBottom
    );

    const cells = Array.from(grid.querySelectorAll<HTMLElement>("[data-row]"));
    const rects = cells.map((cell) => cell.getBoundingClientRect());

    // Sample points within the visible region; each must be covered by a rendered cell
    let uncovered = 0;
    if (right > left && bottom > top) {
      for (let x = left + 1; x < right; x += 37) {
        for (let y = top + 1; y < bottom; y += 13) {
          if (
            !rects.some(
              (rect) =>
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            )
          ) {
            uncovered++;
          }
        }
      }
    }

    return {
      gridScrollsHorizontally: grid.scrollWidth > grid.clientWidth,
      gridScrollsVertically: grid.scrollHeight > grid.clientHeight,
      pageScrollsHorizontally:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      renderedCells: cells.length,
      uncovered
    };
  });
}

test.describe("Grid with window scrollElement", () => {
  test("rows scroll with the page and columns scroll within the grid", async ({
    page
  }) => {
    await page.goto(`${HOST}/grid-scroll-element`);
    await settle(page);

    let state = await getGridState(page);
    expect(state.gridScrollsHorizontally).toBe(true);
    expect(state.gridScrollsVertically).toBe(false);
    expect(state.pageScrollsHorizontally).toBe(false);
    expect(state.uncovered).toBe(0);

    for (const [x, y] of [
      [0, 500],
      [2500, 500],
      [5000, 9000],
      [9000, 14_900]
    ]) {
      await page.evaluate(
        ([x, y]) => {
          window.scrollTo(0, y);
          document.querySelector('[role="grid"]')!.scrollLeft = x;
        },
        [x, y]
      );
      await settle(page);
      state = await getGridState(page);
      expect(state.uncovered, `x=${x} y=${y}`).toBe(0);
      expect(state.renderedCells).toBeLessThan(250);
    }
  });

  test("scrollToCell scrolls the grid horizontally and the page vertically", async ({
    page
  }) => {
    await page.goto(
      `${HOST}/grid-scroll-element?align=start&index=250&column=30`
    );
    await settle(page);
    await page.getByText("Jump", { exact: true }).click();
    await settle(page);

    const rect = await page.evaluate(() => {
      const grid = document.querySelector('[role="grid"]')!;
      const cell = document.querySelector('[data-row="250"][data-column="30"]');
      return cell
        ? {
            cell: cell.getBoundingClientRect().toJSON(),
            grid: grid.getBoundingClientRect().toJSON()
          }
        : null;
    });
    expect(rect).not.toBeNull();
    expect(Math.abs(rect!.cell.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(rect!.cell.left - rect!.grid.left)).toBeLessThanOrEqual(1);
    expect((await getGridState(page)).uncovered).toBe(0);
  });

  test("rows and columns both scroll with the page", async ({ page }) => {
    await page.goto(`${HOST}/grid-scroll-element?full`);
    await settle(page);

    let state = await getGridState(page);
    expect(state.gridScrollsHorizontally).toBe(false);
    expect(state.pageScrollsHorizontally).toBe(true);

    for (const [x, y] of [
      [500, 500],
      [4321, 7000],
      [9500, 14_900]
    ]) {
      await page.evaluate(([x, y]) => window.scrollTo(x, y), [x, y]);
      await settle(page);
      state = await getGridState(page);
      expect(state.uncovered, `x=${x} y=${y}`).toBe(0);
      expect(state.renderedCells).toBeLessThan(250);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByText("Jump", { exact: true }).click();
    await settle(page);
    const cell = await page.evaluate(() =>
      document
        .querySelector('[data-row="250"][data-column="30"]')
        ?.getBoundingClientRect()
        .toJSON()
    );
    expect(cell).toBeDefined();
    expect(Math.abs(cell.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(cell.left)).toBeLessThanOrEqual(1);
  });

  test("RTL rows and columns both scroll with the page", async ({ page }) => {
    await page.goto(`${HOST}/grid-scroll-element?full&dir=rtl`);
    await settle(page);
    expect((await getGridState(page)).uncovered).toBe(0);

    for (const x of [-500, -4321, -9000]) {
      await page.evaluate((x) => window.scrollTo(x, 1000), x);
      await settle(page);
      expect((await getGridState(page)).uncovered, `x=${x}`).toBe(0);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByText("Jump", { exact: true }).click();
    await settle(page);
    const cell = await page.evaluate(() =>
      document
        .querySelector('[data-row="250"][data-column="30"]')
        ?.getBoundingClientRect()
        .toJSON()
    );
    expect(cell).toBeDefined();
    expect(Math.abs(cell.top)).toBeLessThanOrEqual(1);
    // RTL "start" is the right edge of the viewport
    expect(
      Math.abs(
        cell.right -
          (await page.evaluate(() => document.documentElement.clientWidth))
      )
    ).toBeLessThanOrEqual(1);
  });
});

test.describe("content before the list changes size without re-rendering it", () => {
  async function changeContentAbove(
    page: Page,
    detail: { height?: number; insert?: boolean }
  ) {
    await page.evaluate(
      (detail) => window.dispatchEvent(new CustomEvent("above", { detail })),
      detail
    );
    await settle(page);
  }

  async function getListTop(page: Page) {
    return page.evaluate(
      () => document.querySelector('[role="list"]')!.getBoundingClientRect().top
    );
  }

  test("content grows within an element scroll element", async ({ page }) => {
    const scroller = '[data-testid="scroller"]';
    await page.goto(`${HOST}/list-scroll-element?element&no-anchor`);
    await page.evaluate((scroller) => {
      document.querySelector(scroller)!.scrollTop = 3000;
    }, scroller);
    await settle(page);
    expect((await getListCoverage(page, scroller)).covered).toBe(true);

    const before = await getListTop(page);
    await changeContentAbove(page, { height: 1200 });
    expect((await getListTop(page)) - before).toBe(900);
    expect((await getListCoverage(page, scroller)).covered).toBe(true);
  });

  test("content shrinks above a window list when the document doesn't resize", async ({
    page
  }) => {
    await page.goto(`${HOST}/list-scroll-element?html-full&no-anchor`);
    await page.evaluate(() => window.scrollTo(0, 100));
    await settle(page);
    expect((await getListCoverage(page)).covered).toBe(true);

    const before = await getListTop(page);
    await changeContentAbove(page, { height: 0 });
    expect((await getListTop(page)) - before).toBe(-300);
    expect((await getListCoverage(page)).covered).toBe(true);
  });

  test("content is inserted before a window list", async ({ page }) => {
    await page.goto(`${HOST}/list-scroll-element?html-full&no-anchor`);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await settle(page);
    expect((await getListCoverage(page)).covered).toBe(true);

    const before = await getListTop(page);
    await changeContentAbove(page, { insert: true });
    expect((await getListTop(page)) - before).toBe(400);
    expect((await getListCoverage(page)).covered).toBe(true);
  });

  test("content grows above a window list", async ({ page }) => {
    await page.goto(`${HOST}/list-scroll-element?no-anchor`);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await settle(page);

    const before = await getListTop(page);
    await changeContentAbove(page, { height: 900 });
    expect((await getListTop(page)) - before).toBe(600);
    expect((await getListCoverage(page)).covered).toBe(true);
  });
});
