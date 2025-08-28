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
