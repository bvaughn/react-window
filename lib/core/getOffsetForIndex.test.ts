import { beforeEach, describe, expect, test } from "vitest";
import { EMPTY_OBJECT } from "../../src/constants";
import type { Align } from "../types";
import { setScrollbarSizeForTests } from "../utils/getScrollbarSize";
import { createCachedBounds } from "./createCachedBounds";
import { getOffsetForIndex } from "./getOffsetForIndex";

describe("getOffsetForIndex", () => {
  beforeEach(() => {
    setScrollbarSizeForTests(0);
  });

  // Mimic Size function but with fixed height to simplify tests
  const itemSize = () => 10;

  type Params = Parameters<typeof getOffsetForIndex>[0];
  const DEFAULT_ARGS: Params = {
    align: "auto",
    cachedBounds: createCachedBounds({
      itemCount: 10,
      itemProps: EMPTY_OBJECT,
      itemSize
    }),
    containerScrollOffset: 0,
    containerSize: 50,
    index: 0,
    itemCount: 10,
    itemSize
  };

  describe("align", () => {
    test.each(["auto", "smart"] as const)(
      "%s scrolls to an offscreen row when the initial total is underestimated",
      (align) => {
        const itemSize = (index: number) => (index === 0 ? 1 : 100);
        const cachedBounds = createCachedBounds({
          itemCount: 100,
          itemProps: EMPTY_OBJECT,
          itemSize
        });
        expect(
          getOffsetForIndex({
            align,
            cachedBounds,
            itemSize,
            itemCount: 100,
            index: 50,
            containerSize: 100,
            containerScrollOffset: 0
          })
        ).toBe(4901);
      }
    );

    test.each(["auto", "smart"] as const)(
      "%s preserves the offset inside an oversized row",
      (align) => {
        const itemSize = 200;
        const cachedBounds = createCachedBounds({
          itemCount: 10,
          itemProps: EMPTY_OBJECT,
          itemSize
        });
        for (const containerScrollOffset of [400, 450, 500]) {
          expect(
            getOffsetForIndex({
              ...DEFAULT_ARGS,
              align,
              cachedBounds,
              itemSize,
              index: 2,
              containerSize: 100,
              containerScrollOffset
            })
          ).toBe(containerScrollOffset);
        }
      }
    );

    function createTestHelper(align: Align) {
      return function testHelperAuto(
        index: number,
        expectedOffset: number,
        containerScrollOffset: number = 0
      ) {
        expect(
          getOffsetForIndex({
            ...DEFAULT_ARGS,
            align,
            index,
            containerScrollOffset
          })
        ).toBe(expectedOffset);
      };
    }

    test("auto", () => {
      const testHelper = createTestHelper("auto");

      // Scroll forward
      testHelper(0, 0);
      testHelper(4, 0);
      testHelper(5, 10);
      testHelper(9, 50);

      // Scroll backward
      testHelper(0, 0, 100);
      testHelper(4, 40, 100);
    });

    test("center", () => {
      const testHelper = createTestHelper("center");

      testHelper(0, 0);
      testHelper(1, 0);
      testHelper(2, 0);
      testHelper(3, 10);
      testHelper(4, 20);
      testHelper(5, 30);
      testHelper(6, 40);
      testHelper(7, 50);
      testHelper(8, 50);
      testHelper(9, 50);
    });

    test("start", () => {
      const testHelper = createTestHelper("start");

      testHelper(0, 0);
      testHelper(1, 10);
      testHelper(2, 20);
      testHelper(3, 30);
      testHelper(4, 40);
      testHelper(4, 40);
      testHelper(5, 50);
      testHelper(6, 50);
      testHelper(7, 50);
      testHelper(8, 50);
      testHelper(9, 50);
    });

    test("end", () => {
      const testHelper = createTestHelper("end");

      testHelper(0, 0);
      testHelper(1, 0);
      testHelper(2, 0);
      testHelper(3, 0);
      testHelper(4, 0);
      testHelper(4, 0);
      testHelper(5, 10);
      testHelper(6, 20);
      testHelper(7, 30);
      testHelper(8, 40);
      testHelper(9, 50);
    });

    test("smart", () => {
      const testHelper = createTestHelper("smart");

      // Shouldn't scroll if already visible
      testHelper(0, 0);
      testHelper(3, 0);
      testHelper(3, 30, 30);
      testHelper(7, 30, 30);
      testHelper(7, 50, 50);
      testHelper(9, 50, 100);

      // Should center align if not visible
      testHelper(3, 10, 100);
      testHelper(4, 20, 100);
      testHelper(6, 40, 0);
      testHelper(7, 50, 0);
    });
  });
});

test("variable-size start alignment measures target before estimating total", () => {
  const itemSize = (index: number) => (index < 10 ? 10 : 100);
  const cachedBounds = createCachedBounds({
    itemCount: 100,
    itemSize,
    itemProps: {}
  });
  cachedBounds.get(9);
  expect(
    getOffsetForIndex({
      align: "start",
      cachedBounds,
      itemCount: 100,
      itemSize,
      index: 90,
      containerScrollOffset: 0,
      containerSize: 100
    })
  ).toBe(8100);
});

test("center alignment uses the item midpoint near the start", () => {
  const cachedBounds = createCachedBounds({
    itemCount: 100,
    itemSize: 100,
    itemProps: {}
  });
  expect(
    getOffsetForIndex({
      align: "center",
      cachedBounds,
      itemCount: 100,
      itemSize: 100,
      index: 2,
      containerScrollOffset: 0,
      containerSize: 450
    })
  ).toBe(25);
});

test.each([
  {
    itemSize: 1000,
    itemCount: 10,
    index: 0,
    containerSize: 100,
    expected: 450
  },
  { itemSize: 10, itemCount: 2, index: 1, containerSize: 100, expected: 0 },
  { itemSize: 100, itemCount: 10, index: 9, containerSize: 450, expected: 550 }
])(
  "clamps centered items to the scrollable extent: $expected",
  ({ itemSize, itemCount, index, containerSize, expected }) => {
    const cachedBounds = createCachedBounds({
      itemSize,
      itemCount,
      itemProps: {}
    });
    expect(
      getOffsetForIndex({
        align: "center",
        cachedBounds,
        itemSize,
        itemCount,
        index,
        containerSize,
        containerScrollOffset: 0
      })
    ).toBe(expected);
  }
);
