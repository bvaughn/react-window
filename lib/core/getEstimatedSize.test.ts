import { describe, expect, test } from "vitest";
import { getEstimatedSize } from "./getEstimatedSize";
import { createCachedBounds } from "./createCachedBounds";
import { EMPTY_OBJECT } from "../../src/constants";

describe("getEstimatedSize", () => {
  describe("itemSize: function", () => {
    const itemSize = (index: number) => 10 + index * 10;

    test("should return 0 if no measurements can be taken", () => {
      expect(
        getEstimatedSize({
          cachedBounds: createCachedBounds({
            itemCount: 0,
            itemProps: EMPTY_OBJECT,
            itemSize
          }),
          itemCount: 0,
          itemSize
        })
      ).toBe(0);
    });

    test("should return an average size based on the first item if no measurements have been taken", () => {
      expect(
        getEstimatedSize({
          cachedBounds: createCachedBounds({
            itemCount: 10,
            itemProps: EMPTY_OBJECT,
            itemSize
          }),
          itemCount: 10,
          itemSize
        })
      ).toBe(100);
    });

    test("should return estimated size based on averages of what has been measured so far", () => {
      const cachedBounds = createCachedBounds({
        itemCount: 10,
        itemProps: EMPTY_OBJECT,
        itemSize
      });
      cachedBounds.getItemBounds(4);

      expect(
        getEstimatedSize({
          cachedBounds,
          itemCount: 10,
          itemSize
        })
      ).toBe(300);
    });

    test("should return exact size if all content has been measured", () => {
      const cachedBounds = createCachedBounds({
        itemCount: 10,
        itemProps: EMPTY_OBJECT,
        itemSize
      });

      cachedBounds.getItemBounds(9);

      expect(
        getEstimatedSize({
          cachedBounds,
          itemCount: 10,
          itemSize
        })
      ).toBe(550);
    });
  });

  describe("itemSize: number", () => {
    test("should return exact size even if no measurements have been taken", () => {
      expect(
        getEstimatedSize({
          cachedBounds: createCachedBounds({
            itemCount: 10,
            itemProps: EMPTY_OBJECT,
            itemSize: 25
          }),
          itemCount: 10,
          itemSize: 25
        })
      ).toBe(250);
    });
  });

  describe("itemSize: undefined (lazily measured)", () => {
    test("should return undefined if no measurements have been taken", () => {
      expect(
        getEstimatedSize({
          cachedBounds: createCachedBounds({
            itemCount: 10,
            itemProps: EMPTY_OBJECT,
            itemSize: undefined
          }),
          itemCount: 10,
          itemSize: undefined
        })
      ).toBeUndefined();
    });

    test("should return an estimated size based on measurements that have been taken", () => {
      const cachedBounds = createCachedBounds({
        itemCount: 0,
        itemProps: EMPTY_OBJECT,
        itemSize: undefined
      });
      cachedBounds.setItemSize(0, 10);
      cachedBounds.setItemSize(1, 20);

      expect(
        getEstimatedSize({
          cachedBounds,
          itemCount: 10,
          itemSize: undefined
        })
      ).toBe(150);

      cachedBounds.setItemSize(2, 30);

      expect(
        getEstimatedSize({
          cachedBounds,
          itemCount: 10,
          itemSize: undefined
        })
      ).toBe(200);
    });
  });
});
