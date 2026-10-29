import { expect, test, type Page } from "@playwright/test";
import { settle } from "./settle";

const HOST = "http://localhost:3012";

async function load(page: Page, search = "") {
  await page.goto(`${HOST}/list-anchor${search}`);
  await page.locator('[data-index="199"]').waitFor();
  // Wait for the initial scroll to the bottom (and its corrections) to finish
  await page.waitForTimeout(400);
  await settle(page);
}

function isWindowMode(page: Page) {
  return new URL(page.url()).searchParams.has("window");
}

/** First row that is (at least partially) visible, and its position relative to the top of the viewport */
async function getAnchor(page: Page) {
  return page.evaluate((isWindow) => {
    const list = document.querySelector('[role="list"]')!;
    const viewportTop = isWindow ? 0 : list.getBoundingClientRect().top;
    const rows = Array.from(
      list.querySelectorAll<HTMLElement>("[data-index]")
    ).sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    for (const row of rows) {
      const rect = row.getBoundingClientRect();
      if (rect.bottom > viewportTop + 1) {
        return {
          index: Number(row.dataset.index),
          top: rect.top - viewportTop
        };
      }
    }
    throw Error("No visible rows");
  }, isWindowMode(page));
}

async function getRowTop(page: Page, index: number) {
  return page.evaluate(
    ({ index, isWindow }) => {
      const list = document.querySelector('[role="list"]')!;
      const viewportTop = isWindow ? 0 : list.getBoundingClientRect().top;
      const row = list.querySelector(`[data-index="${index}"]`);
      return row ? row.getBoundingClientRect().top - viewportTop : null;
    },
    { index, isWindow: isWindowMode(page) }
  );
}

async function getScrollTop(page: Page) {
  return page.evaluate((isWindow) => {
    return isWindow
      ? window.scrollY
      : document.querySelector('[role="list"]')!.scrollTop;
  }, isWindowMode(page));
}

async function scrollBy(page: Page, delta: number) {
  await page.evaluate(
    ({ delta, isWindow }) => {
      const target = isWindow
        ? window
        : document.querySelector('[role="list"]')!;
      target.scrollBy({ behavior: "instant", top: delta });
    },
    { delta, isWindow: isWindowMode(page) }
  );
}

async function expand(
  page: Page,
  index: number,
  anchor?: { duration?: number; index: number }
) {
  await page.evaluate(
    ({ anchor, index }) => {
      window.dispatchEvent(
        new CustomEvent("expand", { detail: { anchor, index } })
      );
    },
    { anchor, index }
  );
}

/**
 * For each step, how far the row at the top of the viewport moved (beyond the distance scrolled),
 * and how far the list adjusted the scroll position to make up for rows that were measured
 */
async function scrollUpAndMeasureDrift(page: Page, steps: number) {
  // Scrolling to the bottom measured the rows near it; jump past them
  await scrollBy(page, -2000);
  await page.waitForTimeout(400);
  await settle(page);

  const corrections: number[] = [];
  const drift: number[] = [];
  for (let step = 0; step < steps; step++) {
    const anchor = await getAnchor(page);
    const scrollTop = await getScrollTop(page);
    await scrollBy(page, -300);
    // Rows that grow after their first render do so 150ms later
    await page.waitForTimeout(400);
    await settle(page);
    const top = await getRowTop(page, anchor.index);
    expect(top).not.toBeNull();
    corrections.push((await getScrollTop(page)) - (scrollTop - 300));
    drift.push(top! - anchor.top - 300);
  }
  return { corrections, drift };
}

for (const search of ["", "?grow", "?window", "?window&grow"]) {
  test(`scrolling up through unmeasured rows doesn't move the rows in view (${search || "default"})`, async ({
    page
  }) => {
    await load(page, search);
    const { corrections, drift } = await scrollUpAndMeasureDrift(page, 4);
    for (const value of drift) {
      expect(Math.abs(value)).toBeLessThanOrEqual(1);
    }
    // Without corrections, the rows in view would have moved
    expect(Math.max(...corrections.map(Math.abs))).toBeGreaterThan(1);
  });
}

test("wheel scrolling through unmeasured rows doesn't move the rows in view", async ({
  browserName,
  page
}) => {
  // Other browsers scale wheel deltas, so the distance scrolled isn't known ahead of time
  test.skip(browserName !== "chromium");

  await load(page, "?grow");
  const box = await page.locator('[role="list"]').boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);

  const anchor = await getAnchor(page);
  for (let index = 0; index < 8; index++) {
    await page.mouse.wheel(0, -40);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(resolve))
    );
  }
  await page.waitForTimeout(400);
  await settle(page);

  const top = await getRowTop(page, anchor.index);
  expect(top).not.toBeNull();
  expect(Math.abs(top! - anchor.top - 320)).toBeLessThanOrEqual(1);
});

for (const search of ["", "?window"]) {
  test(`expanding and collapsing a row above the viewport doesn't move the rows in view (${search || "default"})`, async ({
    page
  }) => {
    await load(page, search);
    await scrollBy(page, -1000);
    await settle(page);

    const anchor = await getAnchor(page);
    // Overscanned (and measured) rows are rendered above the viewport
    const index = anchor.index - 2;
    expect(await getRowTop(page, index)).not.toBeNull();

    for (let step = 0; step < 2; step++) {
      await expand(page, index);
      await settle(page);
      const top = await getRowTop(page, anchor.index);
      expect(Math.abs(top! - anchor.top)).toBeLessThanOrEqual(1);
    }
  });
}

test("corrections happen before paint", async ({ page }) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const anchor = await getAnchor(page);
  const tops = await page.evaluate(async (anchor) => {
    const list = document.querySelector('[role="list"]')!;
    const getTop = () =>
      list
        .querySelector(`[data-index="${anchor.index}"]`)!
        .getBoundingClientRect().top - list.getBoundingClientRect().top;

    // Frames run before the browser paints, so they see what's on screen
    const tops: number[] = [];
    window.dispatchEvent(
      new CustomEvent("expand", { detail: { index: anchor.index - 1 } })
    );
    for (let frame = 0; frame < 10; frame++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      tops.push(getTop());
    }
    return tops;
  }, anchor);

  for (const top of tops) {
    expect(Math.abs(top - anchor.top)).toBeLessThanOrEqual(1);
  }
});

test("rows that grow below the top of the viewport don't change the scroll position", async ({
  page
}) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const scrollTop = await getScrollTop(page);
  const anchor = await getAnchor(page);
  await expand(page, anchor.index + 1);
  await settle(page);
  await expand(page, anchor.index + 2);
  await settle(page);

  expect(await getScrollTop(page)).toBe(scrollTop);
  expect(
    Math.abs((await getRowTop(page, anchor.index))! - anchor.top)
  ).toBeLessThanOrEqual(1);
});

test("lists scrolled to the end are left alone", async ({ page }) => {
  await load(page);

  const scrollTop = await getScrollTop(page);
  const anchor = await getAnchor(page);
  await expand(page, anchor.index - 1);
  await settle(page);

  expect(await getScrollTop(page)).toBe(scrollTop);
});

test("by default, the first visible row grows upward (keeping the rows after it in place)", async ({
  page
}) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const anchor = await getAnchor(page);
  const nextTop = await getRowTop(page, anchor.index + 1);
  await expand(page, anchor.index);
  await settle(page);

  expect(
    Math.abs((await getRowTop(page, anchor.index + 1))! - nextTop!)
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs((await getRowTop(page, anchor.index))! - (anchor.top - 100))
  ).toBeLessThanOrEqual(1);
});

for (const search of ["", "?window"]) {
  test(`anchorRow keeps a row that grows in place (${search || "default"})`, async ({
    page
  }) => {
    await load(page, search);
    await scrollBy(page, -1000);
    await settle(page);

    const anchor = await getAnchor(page);
    const nextTop = await getRowTop(page, anchor.index + 1);
    for (let step = 0; step < 2; step++) {
      await expand(page, anchor.index, { index: anchor.index });
      await settle(page);

      expect(
        Math.abs((await getRowTop(page, anchor.index))! - anchor.top)
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs(
          (await getRowTop(page, anchor.index + 1))! -
            (nextTop! + (step === 0 ? 100 : 0))
        )
      ).toBeLessThanOrEqual(1);
    }
  });
}

test("anchorRow is ignored for rows that aren't visible", async ({ page }) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const anchor = await getAnchor(page);
  await expand(page, anchor.index - 1, { index: 0 });
  await settle(page);

  expect(
    Math.abs((await getRowTop(page, anchor.index))! - anchor.top)
  ).toBeLessThanOrEqual(1);
});

test("anchorRow expires after its duration", async ({ page }) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  // The row is measured after the duration has passed, so the first visible row grows upward (as by default)
  const anchor = await getAnchor(page);
  const nextTop = await getRowTop(page, anchor.index + 1);
  await expand(page, anchor.index, { duration: 0, index: anchor.index });
  await settle(page);

  expect(
    Math.abs((await getRowTop(page, anchor.index + 1))! - nextTop!)
  ).toBeLessThanOrEqual(1);
});

/** Inserts rows at the start, and returns the scroll position before and after the commit that renders them */
async function prepend(page: Page, count: number, correct = false) {
  return page.evaluate(
    async ({ correct, count }) => {
      const list = document.querySelector('[role="list"]')!;
      const scrollHeight = list.scrollHeight;
      const scrollTop = list.scrollTop;
      window.dispatchEvent(
        new CustomEvent("prepend", { detail: { correct, count } })
      );
      // The commit that renders the new rows changes the (estimated) scroll height
      for (let frame = 0; frame < 10; frame++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (list.scrollHeight !== scrollHeight) {
          return {
            scrollHeightDelta: list.scrollHeight - scrollHeight,
            scrollTopAfter: list.scrollTop,
            scrollTopBefore: scrollTop
          };
        }
      }
      throw Error("Rows were not prepended");
    },
    { correct, count }
  );
}

// Without rowKey, heights are cached by index (and inserted rows can't be told apart from rows that moved),
// so rows inserted above the viewport still move the rows in view; these tests make sure that maintaining the
// scroll position doesn't make it worse (see the rowKey tests below for lists that can be kept in place)
test("prepending rows doesn't change the scroll position", async ({ page }) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const { scrollTopAfter, scrollTopBefore } = await prepend(page, 20);
  expect(scrollTopAfter).toBe(scrollTopBefore);
});

test("prepending rows doesn't interfere with an app that adjusts the scroll position itself", async ({
  page
}) => {
  await load(page);
  await scrollBy(page, -1000);
  await settle(page);

  const { scrollHeightDelta, scrollTopAfter, scrollTopBefore } = await prepend(
    page,
    20,
    true
  );
  expect(scrollHeightDelta).toBeGreaterThan(0);
  expect(scrollTopAfter).toBe(scrollTopBefore + scrollHeightDelta);
});

/** Visible rows (by id, in order) and their positions relative to the top of the viewport */
async function getVisibleRows(page: Page) {
  return page.evaluate((isWindow) => {
    const list = document.querySelector('[role="list"]')!;
    const viewportTop = isWindow ? 0 : list.getBoundingClientRect().top;
    const viewportBottom = isWindow
      ? window.innerHeight
      : list.getBoundingClientRect().bottom;
    return Array.from(list.querySelectorAll<HTMLElement>("[data-id]"))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
      .filter((row) => {
        const rect = row.getBoundingClientRect();
        return rect.bottom > viewportTop + 1 && rect.top < viewportBottom - 1;
      })
      .map((row) => ({
        id: row.dataset.id!,
        top: row.getBoundingClientRect().top - viewportTop
      }));
  }, isWindowMode(page));
}

/** Dispatches an event that changes the rows, and returns the position of a row (by id) in each of the following frames */
async function changeRowsAndTrack(
  page: Page,
  type: "insert" | "prepend" | "remove",
  detail: object,
  id: string
) {
  return page.evaluate(
    async ({ detail, id, isWindow, type }) => {
      const list = document.querySelector('[role="list"]')!;
      const getTop = () => {
        const row = list.querySelector(`[data-id="${id}"]`);
        return row
          ? row.getBoundingClientRect().top -
              (isWindow ? 0 : list.getBoundingClientRect().top)
          : null;
      };

      window.dispatchEvent(new CustomEvent(type, { detail }));
      const tops: (number | null)[] = [];
      for (let frame = 0; frame < 10; frame++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        tops.push(getTop());
      }
      return tops;
    },
    { detail, id, isWindow: isWindowMode(page), type }
  );
}

function expectInPlace(tops: (number | null)[], top: number) {
  for (const value of tops) {
    expect(value).not.toBeNull();
    expect(Math.abs(value! - top)).toBeLessThanOrEqual(1);
  }
}

for (const search of ["?keys", "?keys&window"]) {
  test.describe(`with rowKey (${search})`, () => {
    test.beforeEach(async ({ page }) => {
      await load(page, search);
      await scrollBy(page, -1000);
      await settle(page);
    });

    test("prepending rows doesn't move the rows in view", async ({ page }) => {
      const [anchor] = await getVisibleRows(page);
      expectInPlace(
        await changeRowsAndTrack(page, "prepend", { count: 20 }, anchor.id),
        anchor.top
      );
    });

    test("prepending rows and removing as many from the end doesn't move the rows in view", async ({
      page
    }) => {
      // Far enough from the end that the removed rows aren't in view
      await scrollBy(page, -2000);
      await settle(page);

      const [anchor] = await getVisibleRows(page);
      expectInPlace(
        await changeRowsAndTrack(
          page,
          "prepend",
          { count: 20, trim: 20 },
          anchor.id
        ),
        anchor.top
      );
    });

    test("inserting rows above the viewport doesn't move the rows in view", async ({
      page
    }) => {
      const [anchor] = await getVisibleRows(page);
      const index = await getAnchor(page).then(({ index }) => index);
      expectInPlace(
        await changeRowsAndTrack(
          page,
          "insert",
          { count: 5, index: index - 10 },
          anchor.id
        ),
        anchor.top
      );
    });

    test("removing rows above the viewport doesn't move the rows in view", async ({
      page
    }) => {
      const [anchor] = await getVisibleRows(page);
      const index = await getAnchor(page).then(({ index }) => index);
      expectInPlace(
        await changeRowsAndTrack(
          page,
          "remove",
          { count: 5, index: index - 10 },
          anchor.id
        ),
        anchor.top
      );
    });

    test("removing the first visible row doesn't move the rows after it", async ({
      page
    }) => {
      const [, next] = await getVisibleRows(page);
      const index = await getAnchor(page).then(({ index }) => index);
      expectInPlace(
        await changeRowsAndTrack(page, "remove", { count: 1, index }, next.id),
        next.top
      );
    });
  });
}

for (const search of ["?keys", "?keys&window"]) {
  test.describe(`with rowKey at the start or end of the list (${search})`, () => {
    test("prepending rows at the top of the list doesn't move the rows in view", async ({
      page
    }) => {
      await load(page, search);
      await scrollBy(page, -100_000);
      await settle(page);
      expect(await getScrollTop(page)).toBe(0);

      const [anchor] = await getVisibleRows(page);
      expectInPlace(
        await changeRowsAndTrack(page, "prepend", { count: 20 }, anchor.id),
        anchor.top
      );
    });

    test("prepending rows while scrolled to the end doesn't move the rows in view", async ({
      page
    }) => {
      // The content's estimated size is too small for the correction until the rows around the anchor are rendered
      await load(page, search);

      const [anchor] = await getVisibleRows(page);
      expectInPlace(
        await changeRowsAndTrack(page, "prepend", { count: 20 }, anchor.id),
        anchor.top
      );
    });

    test("appending rows while scrolled to the end doesn't change the scroll position", async ({
      page
    }) => {
      await load(page, search);

      const scrollTop = await getScrollTop(page);
      await page.evaluate(() =>
        window.dispatchEvent(
          new CustomEvent("insert", { detail: { count: 5, index: 200 } })
        )
      );
      await settle(page);
      expect(await getScrollTop(page)).toBe(scrollTop);
    });

    test("anchorRow keeps a row in place while it grows and rows are inserted before it", async ({
      page
    }) => {
      await load(page, search);
      await scrollBy(page, -1000);
      await settle(page);

      const [anchor, next] = await getVisibleRows(page);
      const index = await getAnchor(page).then(({ index }) => index);
      const tops = await page.evaluate(
        async ({ id, index, isWindow, nextId }) => {
          const list = document.querySelector('[role="list"]')!;
          const getTop = (id: string) =>
            list.querySelector(`[data-id="${id}"]`)!.getBoundingClientRect()
              .top - (isWindow ? 0 : list.getBoundingClientRect().top);

          // In the same update: the row grows (100px) and rows are inserted before it
          window.dispatchEvent(
            new CustomEvent("expand", { detail: { anchor: { index }, index } })
          );
          window.dispatchEvent(
            new CustomEvent("prepend", { detail: { count: 20 } })
          );

          const tops: { next: number; row: number }[] = [];
          for (let frame = 0; frame < 10; frame++) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            tops.push({ next: getTop(nextId), row: getTop(id) });
          }
          return tops;
        },
        {
          id: anchor.id,
          index,
          isWindow: isWindowMode(page),
          nextId: next.id
        }
      );

      for (const top of tops) {
        expect(Math.abs(top.row - anchor.top)).toBeLessThanOrEqual(1);
      }
      // Once it's measured, the row grows downward (moving the rows after it)
      expect(
        Math.abs(tops[tops.length - 1].next - (next.top + 100))
      ).toBeLessThanOrEqual(1);
    });
  });
}

test("prepending rows while touch scrolling shifts the rows (and adjusts the scroll position once scrolling stops)", async ({
  page
}) => {
  await load(page, "?keys");
  await scrollBy(page, -1000);
  await settle(page);

  const [anchor] = await getVisibleRows(page);
  const scrollTop = await getScrollTop(page);
  await dispatchTouchEvent(page, "touchstart");
  expectInPlace(
    await changeRowsAndTrack(page, "prepend", { count: 20 }, anchor.id),
    anchor.top
  );
  // The scroll position isn't changed while touching
  expect(await getScrollTop(page)).toBe(scrollTop);

  await dispatchTouchEvent(page, "touchend");
  await page.waitForTimeout(400);
  await settle(page);
  expect(await getScrollTop(page)).toBeGreaterThan(scrollTop);
  const row = (await getVisibleRows(page)).find(({ id }) => id === anchor.id);
  expect(row).toBeDefined();
  expect(Math.abs(row!.top - anchor.top)).toBeLessThanOrEqual(1);
});

async function dispatchTouchEvent(page: Page, type: "touchend" | "touchstart") {
  await page.evaluate(
    ({ isWindow, type }) => {
      const target = isWindow
        ? window
        : document.querySelector('[role="list"]')!;
      target.dispatchEvent(new Event(type));
    },
    { isWindow: isWindowMode(page), type }
  );
}

// iOS ignores changes to the scroll position while the user is touch scrolling,
// so the list shifts its rows instead, and adjusts the scroll position once scrolling stops
for (const search of ["?grow", "?window&grow"]) {
  test(`touch scrolling through unmeasured rows doesn't move the rows in view (${search})`, async ({
    page
  }) => {
    await load(page, search);
    await scrollBy(page, -2000);
    await page.waitForTimeout(400);
    await settle(page);

    await dispatchTouchEvent(page, "touchstart");
    for (let step = 0; step < 3; step++) {
      const anchor = await getAnchor(page);
      const scrollTop = await getScrollTop(page);
      await scrollBy(page, -300);
      await page.waitForTimeout(400);
      await settle(page);

      // The scroll position isn't changed while touching
      expect(await getScrollTop(page)).toBe(scrollTop - 300);
      const top = await getRowTop(page, anchor.index);
      expect(top).not.toBeNull();
      expect(Math.abs(top! - (anchor.top + 300))).toBeLessThanOrEqual(1);
    }

    const anchor = await getAnchor(page);
    // Record each frame until the scroll position has been adjusted
    const tops = await page.evaluate(
      async ({ index, isWindow }) => {
        const list = document.querySelector('[role="list"]')!;
        const target = isWindow ? window : list;
        const getScrollTop = () => (isWindow ? window.scrollY : list.scrollTop);
        const getTop = () =>
          list.querySelector(`[data-index="${index}"]`)!.getBoundingClientRect()
            .top - (isWindow ? 0 : list.getBoundingClientRect().top);

        const scrollTop = getScrollTop();
        const tops: number[] = [];
        target.dispatchEvent(new Event("touchend"));
        for (let frame = 0; frame < 60; frame++) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          tops.push(getTop());
          if (getScrollTop() !== scrollTop) {
            return { adjusted: true, tops };
          }
        }
        return { adjusted: false, tops };
      },
      { index: anchor.index, isWindow: isWindowMode(page) }
    );

    expect(tops.adjusted).toBe(true);
    for (const top of tops.tops) {
      expect(Math.abs(top - anchor.top)).toBeLessThanOrEqual(1);
    }
  });
}

/** Starts a touch scroll and scrolls up through rows that grow after they're rendered, so that the rows are shifted */
async function startTouchScroll(page: Page) {
  await load(page, "?grow");
  await scrollBy(page, -2000);
  await page.waitForTimeout(400);
  await settle(page);

  // Touch a row (rather than the list itself), as a user would
  await page.evaluate(() => {
    const list = document.querySelector('[role="list"]')!;
    const row = Array.from(list.querySelectorAll<HTMLElement>("[data-index]"))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
      .find(
        (row) =>
          row.getBoundingClientRect().top >= list.getBoundingClientRect().top
      )!;
    (window as unknown as { touchedRow: HTMLElement }).touchedRow = row;
    row.dispatchEvent(new Event("touchstart", { bubbles: true }));
  });

  for (let step = 0; step < 2; step++) {
    await scrollBy(page, -300);
    await page.waitForTimeout(400);
    await settle(page);
  }
}

/** Ends the touch on the row that was touched, and returns whether the scroll position was adjusted within the specified number of frames */
async function endTouchScroll(
  page: Page,
  { frames = 60, touches = 0 }: { frames?: number; touches?: number } = {}
) {
  return page.evaluate(
    async ({ frames, touches }) => {
      const list = document.querySelector('[role="list"]')!;
      const row = (window as unknown as { touchedRow: HTMLElement }).touchedRow;

      const event = new Event("touchend", { bubbles: true });
      Object.defineProperty(event, "touches", {
        value: Array.from({ length: touches }, () => ({}))
      });

      const scrollTop = list.scrollTop;
      row.dispatchEvent(event);
      for (let frame = 0; frame < frames; frame++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (list.scrollTop !== scrollTop) {
          return true;
        }
      }
      return false;
    },
    { frames, touches }
  );
}

test("touch scrolling ends when the touched row unmounts", async ({ page }) => {
  await startTouchScroll(page);

  // Scroll far enough that the touched row unmounts; touch events then stop bubbling to the list
  await scrollBy(page, -2000);
  await page.waitForTimeout(400);
  await settle(page);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { touchedRow: HTMLElement }).touchedRow
          .isConnected
    )
  ).toBe(false);

  expect(await endTouchScroll(page)).toBe(true);
});

test("touch scrolling continues while other fingers are touching", async ({
  page
}) => {
  await startTouchScroll(page);

  expect(await endTouchScroll(page, { frames: 30, touches: 1 })).toBe(false);
  expect(await endTouchScroll(page)).toBe(true);
});

test("smooth scrollToRow after touch scrolling lands on its row", async ({
  page
}) => {
  await startTouchScroll(page);

  // A row in the overscan above the viewport, so that it's rendered throughout
  const anchor = await getAnchor(page);
  const index = anchor.index - 2;
  expect(await getRowTop(page, index)).not.toBeNull();

  const tops = await page.evaluate(async (index) => {
    const list = document.querySelector('[role="list"]')!;
    const getTop = () =>
      list.querySelector(`[data-index="${index}"]`)!.getBoundingClientRect()
        .top - list.getBoundingClientRect().top;

    window.dispatchEvent(
      new CustomEvent("scroll-to-row", {
        detail: { align: "start", behavior: "smooth", index }
      })
    );
    // Scrolling stops during the animation (see the List unit tests for how the shift is replaced)
    list.dispatchEvent(new Event("touchend"));

    const tops: number[] = [];
    for (let frame = 0; frame < 60; frame++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      tops.push(getTop());
    }
    return tops;
  }, index);

  // The row moves down into place without moving back up
  for (let frame = 1; frame < tops.length; frame++) {
    expect(tops[frame]).toBeGreaterThanOrEqual(tops[frame - 1] - 1);
  }
  expect(Math.abs(tops[tops.length - 1])).toBeLessThanOrEqual(1);
});
