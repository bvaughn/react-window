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

  test("should cache measured sizes", () => {
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

    // Failed assertions are also logged
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      cachedBounds.get(1);
    }).toThrow("Invalid index 1");
    expect(consoleError).toHaveBeenCalledWith("Invalid index 1");

    consoleError.mockRestore();
  });
});

test("fixed-size lookups do not allocate bounds", () => {
  const cachedBounds = createCachedBounds({
    itemCount: 1000000,
    itemProps: {},
    itemSize: 20
  });
  expect(cachedBounds.get(999999)).toEqual({
    scrollOffset: 19999980,
    size: 20
  });
  expect(cachedBounds.size).toBe(0);
  expect(cachedBounds.get(0)).toEqual({ scrollOffset: 0, size: 20 });
  expect(cachedBounds.size).toBe(0);
});
