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

    expect(cachedBounds.getItemBounds(2)).toEqual({
      scrollOffset: 21,
      size: 12
    });
    expect(itemSize).toHaveBeenCalledTimes(3);
    expect(cachedBounds.size).toBe(3);

    expect(cachedBounds.getItemBounds(3)).toEqual({
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

    cachedBounds.getItemBounds(9);

    expect(itemSize).toHaveBeenCalledTimes(10);
    expect(cachedBounds.size).toBe(10);

    for (let index = 0; index < 10; index++) {
      cachedBounds.getItemBounds(index);
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
      cachedBounds.getItemBounds(1);
    }).toThrow("Invalid index 1");
  });

  test("should gracefully handle undefined item sizes", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 10,
      itemProps: {},
      itemSize: undefined
    });

    cachedBounds.setItemSize(0, 10);

    expect(cachedBounds.size).toBe(1);
    expect(cachedBounds.getItemBounds(0)).toEqual({
      scrollOffset: 0,
      size: 10
    });

    cachedBounds.setItemSize(1, 20);

    expect(cachedBounds.size).toBe(2);
    expect(cachedBounds.getItemBounds(1)).toEqual({
      scrollOffset: 10,
      size: 20
    });
  });

  test("should gracefully handle sparsely populated cache", () => {
    const cachedBounds = createCachedBounds({
      itemCount: 5,
      itemProps: {},
      itemSize: undefined
    });

    expect(cachedBounds.getEstimatedSize()).toBeUndefined();

    cachedBounds.setItemSize(0, 10);
    cachedBounds.setItemSize(2, 20);
    cachedBounds.setItemSize(4, 30);

    // Estimated average should be based on measured cells
    expect(cachedBounds.getEstimatedSize()).toBe(20);

    // Bounds offsets based on measured cells; gaps should be filled in by averages
    expect(cachedBounds.getItemBounds(0)).toEqual({
      scrollOffset: 0,
      size: 10
    });
    expect(cachedBounds.getItemBounds(1)).toBeUndefined();
    expect(cachedBounds.getItemBounds(2)).toEqual({
      scrollOffset: 30,
      size: 20
    });
    expect(cachedBounds.getItemBounds(3)).toBeUndefined();
    expect(cachedBounds.getItemBounds(4)).toEqual({
      scrollOffset: 70,
      size: 30
    });
  });
});
