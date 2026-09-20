import { expect, test, type Page } from "@playwright/test";

const HOST = "http://localhost:3012";

async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let i = 0; i < 75; i++) await new Promise(requestAnimationFrame);
  });
}

async function bounds(page: Page, index: number) {
  return page.evaluate((index) => {
    const list = document.querySelector('[role="list"]')!;
    const row = list.querySelector(`[data-index="${index}"]`);
    if (!row) return null;
    const viewport = list.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    return {
      top: rect.top - viewport.top,
      bottom: rect.bottom - viewport.top,
      center: (rect.top + rect.bottom) / 2 - viewport.top
    };
  }, index);
}

for (const scale of [0.5, 1, 2]) {
  test(`settles promptly under ancestor scale ${scale}`, async ({ page }) => {
    await page.goto(`${HOST}/list-dynamic?estimate=25&align=start`);
    // Exercise fractional border-box sizes as well as transformed geometry.
    await page.addStyleTag({
      content:
        '[role="listitem"] { height: 40.5px !important; border: 2px solid; padding: 3px; box-sizing: border-box; }'
    });
    const frames = await page.evaluate(async (scale) => {
      document.body.style.transform = `scale(${scale})`;
      const requestFrame = window.requestAnimationFrame.bind(window);
      let corrections = 0;
      window.requestAnimationFrame = (callback) => {
        corrections++;
        return requestFrame(callback);
      };
      try {
        document.querySelector<HTMLButtonElement>("button")!.click();
        // Use the original function so the test's own frames are not counted.
        for (let index = 0; index < 40; index++) {
          await new Promise(requestFrame);
        }
        return corrections;
      } finally {
        window.requestAnimationFrame = requestFrame;
      }
    }, scale);
    expect(frames).toBeGreaterThan(0);
    expect(frames).toBeLessThan(20);
    const rect = await bounds(page, 250);
    expect(rect).not.toBeNull();
    expect(Math.abs(rect!.top / scale)).toBeLessThanOrEqual(1);
  });
}

for (const estimate of [10, 120]) {
  for (const align of ["auto", "start", "center", "end", "smart"]) {
    test(`corrects ${align} alignment with estimate ${estimate}`, async ({
      page
    }) => {
      await page.goto(
        `${HOST}/list-dynamic?estimate=${estimate}&align=${align}`
      );
      await page.getByText("Jump", { exact: true }).click();
      await settle(page);
      const rect = await bounds(page, 250);
      expect(rect).not.toBeNull();
      if (!rect) return;
      if (align === "start") expect(Math.abs(rect.top)).toBeLessThanOrEqual(1);
      else if (align === "center" || align === "smart")
        expect(Math.abs(rect.center - 100)).toBeLessThanOrEqual(1);
      else if (align === "end")
        expect(Math.abs(rect.bottom - 200)).toBeLessThanOrEqual(1);
      else {
        expect(rect.top).toBeGreaterThanOrEqual(-1);
        expect(rect.bottom).toBeLessThanOrEqual(201);
      }
    });
  }
}

test("reaches the last row", async ({ page }) => {
  await page.goto(`${HOST}/list-dynamic?estimate=10&index=499&align=end`);
  await page.getByText("Jump", { exact: true }).click();
  await settle(page);
  const rect = await bounds(page, 499);
  expect(rect).not.toBeNull();
  expect(Math.abs(rect!.bottom - 200)).toBeLessThanOrEqual(1);
});

test("scrolls to the last row without measuring additional children", async ({
  page
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    `${HOST}/list-dynamic?estimate=25&index=499&align=end&overlay`
  );
  await page.getByText("Jump", { exact: true }).click();
  await settle(page);
  expect(errors).toEqual([]);
  await expect(page.getByTestId("overlay")).not.toHaveAttribute(
    "data-react-window-index"
  );
  const rect = await bounds(page, 499);
  expect(rect).not.toBeNull();
  expect(Math.abs(rect!.bottom - 200)).toBeLessThanOrEqual(1);
});

test("auto alignment settles for rows taller than the viewport", async ({
  page
}) => {
  await page.goto(`${HOST}/list-dynamic?estimate=10&tall`);
  await page.getByText("Jump", { exact: true }).click();
  await settle(page);
  const rect = await bounds(page, 250);
  expect(rect).not.toBeNull();
  expect(rect!.top).toBeLessThanOrEqual(1);
  expect(rect!.bottom).toBeGreaterThanOrEqual(199);
  await settle(page);
  expect(await bounds(page, 250)).toEqual(rect);
});

for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
  test(`cancels correction on ${event}`, async ({ page }) => {
    await page.goto(`${HOST}/list-dynamic?estimate=10`);
    await page.evaluate((event) => {
      document.querySelector<HTMLButtonElement>("button")!.click();
      const list = document.querySelector<HTMLElement>('[role="list"]')!;
      list.dispatchEvent(
        event === "keydown"
          ? new KeyboardEvent(event, { key: "Home" })
          : new Event(event)
      );
      list.scrollTo({ top: 0, behavior: "instant" });
    }, event);
    await settle(page);
    expect(
      await page.locator('[role="list"]').evaluate((el) => el.scrollTop)
    ).toBe(0);
  });
}

test("a newer request replaces the pending target", async ({ page }) => {
  await page.goto(`${HOST}/list-dynamic?estimate=10`);
  await page.evaluate(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>("button");
    buttons[0].click();
    buttons[1].click();
  });
  await settle(page);
  expect(Math.abs((await bounds(page, 20))!.top)).toBeLessThanOrEqual(1);
});

test("removing the target cancels correction", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.goto(`${HOST}/list-dynamic?estimate=10`);
  await page.evaluate(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>("button");
    buttons[0].click();
    buttons[2].click();
  });
  await settle(page);
  expect(errors).toEqual([]);
  expect(await bounds(page, 250)).toBeNull();
});
