import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { EMPTY_OBJECT } from "../../src/constants";
import { useCachedBounds } from "./useCachedBounds";

describe("useCachedBounds", () => {
  test("should cache the CachedBounds unless props change", () => {
    const { result, rerender } = renderHook(
      (props?: Partial<Parameters<typeof useCachedBounds>>[0]) =>
        useCachedBounds({
          itemCount: 1,
          itemProps: EMPTY_OBJECT,
          itemSize: 10,
          ...props
        })
    );

    const cachedBoundsA = result.current;

    rerender({
      itemCount: 1,
      itemProps: EMPTY_OBJECT,
      itemSize: 10
    });
    expect(result.current).toBe(cachedBoundsA);

    rerender({
      itemCount: 1,
      itemProps: EMPTY_OBJECT,
      itemSize: 5
    });
    expect(result.current).not.toBe(cachedBoundsA);

    const cachedBoundsB = result.current;

    rerender({
      itemCount: 1,
      itemProps: EMPTY_OBJECT,
      itemSize: 5
    });
    expect(result.current).toBe(cachedBoundsB);
  });
});
