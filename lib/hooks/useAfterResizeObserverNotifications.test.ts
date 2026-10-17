import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useAfterResizeObserverNotifications } from "./useAfterResizeObserverNotifications";

async function waitForAnimationFrames(count: number) {
  await act(async () => {
    for (let i = 0; i < count; i++) {
      await new Promise(requestAnimationFrame);
    }
  });
}

describe("useAfterResizeObserverNotifications", () => {
  test("should call the callback after two animation frames", async () => {
    const callback = vi.fn();
    const element = document.createElement("div");

    renderHook(() =>
      useAfterResizeObserverNotifications({ callback, element })
    );

    await waitForAnimationFrames(1);
    expect(callback).not.toHaveBeenCalled();

    await waitForAnimationFrames(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("should not call the callback if disabled or if there is no element", async () => {
    const callback = vi.fn();

    renderHook(() =>
      useAfterResizeObserverNotifications({
        callback,
        element: document.createElement("div"),
        enabled: false
      })
    );
    renderHook(() =>
      useAfterResizeObserverNotifications({ callback, element: null })
    );

    await waitForAnimationFrames(3);
    expect(callback).not.toHaveBeenCalled();
  });

  test("should not call the callback after unmounting", async () => {
    const callback = vi.fn();
    const element = document.createElement("div");

    const { unmount } = renderHook(() =>
      useAfterResizeObserverNotifications({ callback, element })
    );

    await waitForAnimationFrames(1);
    unmount();

    await waitForAnimationFrames(2);
    expect(callback).not.toHaveBeenCalled();
  });
});
