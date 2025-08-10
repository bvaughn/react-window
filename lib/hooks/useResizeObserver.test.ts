import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { updateMockResizeObserver } from "../utils/test/mockResizeObserver";
import { useResizeObserver } from "./useResizeObserver";

describe("useResizeObserver", () => {
  beforeEach(() => {
    updateMockResizeObserver({ height: 100, width: 50 });
  });

  test("should use default width/height if disabled", () => {
    const element = document.createElement("div");

    const { result, unmount } = renderHook(() =>
      useResizeObserver({
        defaultHeight: 50,
        defaultWidth: 50,
        element,
        disabled: true,
      }),
    );

    // Initial size on mount should be ignored
    expect(result.current).toEqual({
      height: 50,
      width: 50,
    });

    act(() => {
      // Updates should be ignored as well
      updateMockResizeObserver({ height: 25, target: element });
    });

    expect(result.current).toEqual({
      height: 50,
      width: 50,
    });

    unmount();
  });

  test("should update on mount with the measured dimensions", () => {
    const element = document.createElement("div");

    const { result, unmount } = renderHook(() =>
      useResizeObserver({
        element,
      }),
    );

    expect(result.current).toEqual({
      height: 100,
      width: 50,
    });

    unmount();
  });

  test("should update when dimensions change", () => {
    const element = document.createElement("div");

    const { result, unmount } = renderHook(() =>
      useResizeObserver({
        element,
      }),
    );

    expect(result.current).toEqual({
      height: 100,
      width: 50,
    });

    act(() => {
      updateMockResizeObserver({
        height: 50,
        target: element,
      });
    });

    expect(result.current).toEqual({
      height: 50,
      width: 50,
    });

    unmount();
  });

  test("should ignore resize events from other elements", () => {
    const otherElement = document.createElement("div");

    const { result, unmount } = renderHook(() =>
      useResizeObserver({
        element: document.createElement("div"),
      }),
    );

    act(() => {
      updateMockResizeObserver({
        height: 50,
        target: otherElement,
      });
    });

    expect(result.current).toEqual({
      height: 100,
      width: 50,
    });

    unmount();
  });
});
