import { describe, expect, test, vi } from "vitest";
import { createCachedBounds } from "./createCachedBounds";

describe("createCachedBounds", () => {
  test("should lazily measure items before the requested index", () => {
    const itemSize = vi.fn((index: number) => 10 + index);
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize
    });

    expect(itemSize).not.toHaveBeenCalled();
    expect(cachedBounds.size).toBe(0);

    expect(cachedBounds.get(2)).toEqual({
      scrollOffset: 21,
      size: 12
    });
    expect(itemSize).toHaveBeenCalledTimes(3);
    expect(cachedBounds.size).toBe(3);

    expect(cachedBounds.get(3)).toEqual({
      scrollOffset: 33,
      size: 13
    });
    expect(itemSize).toHaveBeenCalledTimes(4);
    expect(cachedBounds.size).toBe(4);
  });

  test("should cached measured sizes", () => {
    const itemSize = vi.fn(() => 10);

    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize
    });

    expect(itemSize).not.toHaveBeenCalled();
    expect(cachedBounds.size).toBe(0);

    cachedBounds.get(9);

    expect(itemSize).toHaveBeenCalledTimes(10);
    expect(cachedBounds.size).toBe(10);

    for (let index = 0; index < 10; index++) {
      cachedBounds.get(index);
    }

    expect(itemSize).toHaveBeenCalledTimes(10);
    expect(cachedBounds.size).toBe(10);
  });

  test("should gracefully handle an empty cache", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 0,
      itemProps: {},
      itemSize: 10
    });

    expect(cachedBounds.size).toBe(0);

    expect(() => {
      cachedBounds.get(1);
    }).toThrow("Invalid index 1");
  });
});
