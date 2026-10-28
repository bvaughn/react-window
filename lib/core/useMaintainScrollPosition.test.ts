import { describe, expect, test } from "vitest";
import { createCachedBounds } from "./createCachedBounds";
import { shiftCachedBounds } from "./useMaintainScrollPosition";

describe("shiftCachedBounds", () => {
  test("should return the same bounds when not shifted", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });

    expect(shiftCachedBounds(cachedBounds, 0)).toBe(cachedBounds);
  });

  test("should shift each item's offset (but not its size)", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    expect(shiftedBounds.get(0)).toEqual({ scrollOffset: -25, size: 10 });
    expect(shiftedBounds.get(2)).toEqual({ scrollOffset: -4, size: 12 });

    // The original bounds are unchanged
    expect(cachedBounds.get(2)).toEqual({ scrollOffset: 21, size: 12 });
  });

  test("should reflect the size of the original bounds", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    expect(shiftedBounds.size).toBe(0);
    shiftedBounds.get(3);
    expect(shiftedBounds.size).toBe(4);
    expect(cachedBounds.size).toBe(4);
  });

  test("should store unshifted offsets", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: (index: number) => 10 + index
    });
    const shiftedBounds = shiftCachedBounds(cachedBounds, 25);

    shiftedBounds.set(0, { scrollOffset: -25, size: 10 });
    expect(cachedBounds.get(0)).toEqual({ scrollOffset: 0, size: 10 });
    expect(shiftedBounds.get(0)).toEqual({ scrollOffset: -25, size: 10 });
  });

  test("should preserve a fixed item size", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: 20
    });

    expect(shiftCachedBounds(cachedBounds, 25).itemSize).toBe(
      cachedBounds.itemSize
    );
  });
});
