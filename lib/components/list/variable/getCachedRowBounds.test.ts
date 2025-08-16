import { describe, expect, test, vi } from "vitest";
import type { CachedBounds } from "../types";
import { getCachedRowBounds } from "./getCachedRowBounds";

describe("getCachedRowBounds", () => {
  test("should lazily fill in bounds", () => {
    const cachedBounds: CachedBounds = new Map();

    const rowHeight = vi.fn().mockReturnValue(10);

    expect(
      getCachedRowBounds({
        cachedBounds,
        index: 0,
        rowHeight,
        rowProps: {},
      }),
    ).toEqual({ height: 10, scrollTop: 0 });

    expect(rowHeight).toBeCalledTimes(1);

    expect(
      getCachedRowBounds({
        cachedBounds,
        index: 2,
        rowHeight,
        rowProps: {},
      }),
    ).toEqual({ height: 10, scrollTop: 20 });

    expect(rowHeight).toBeCalledTimes(3);

    expect(
      getCachedRowBounds({
        cachedBounds,
        index: 3,
        rowHeight,
        rowProps: {},
      }),
    ).toEqual({ height: 10, scrollTop: 30 });

    expect(rowHeight).toBeCalledTimes(4);
  });

  test("should cache bounds and only request once", () => {
    const cachedBounds: CachedBounds = new Map();

    const rowHeight = vi.fn().mockReturnValue(10);

    expect(
      getCachedRowBounds({
        cachedBounds,
        index: 0,
        rowHeight,
        rowProps: {},
      }),
    ).toEqual({ height: 10, scrollTop: 0 });

    expect(rowHeight).toBeCalledTimes(1);

    expect(
      getCachedRowBounds({
        cachedBounds,
        index: 0,
        rowHeight,
        rowProps: {},
      }),
    ).toEqual({ height: 10, scrollTop: 0 });

    expect(rowHeight).toBeCalledTimes(1);
  });
});
