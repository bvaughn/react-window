import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, onTestFinished, test } from "vitest";
import { useIsScrolling } from "./useIsScrolling";

describe("useIsScrolling", () => {
  let element: HTMLDivElement;

  afterEach(() => {
    element?.remove();
  });

  function createElement() {
    element = document.createElement("div");
    document.body.appendChild(element);
    return element;
  }

  // Remove the event handler property (from whichever prototype defines it) for browsers without scrollend support
  function simulateNoScrollEndSupport() {
    let owner: object | null = window;
    while (
      owner &&
      !Object.prototype.hasOwnProperty.call(owner, "onscrollend")
    ) {
      owner = Object.getPrototypeOf(owner);
    }
    if (!owner) {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(owner, "onscrollend")!;
    // @ts-expect-error Simulate the property being unsupported
    delete owner.onscrollend;
    onTestFinished(() => {
      Object.defineProperty(owner, "onscrollend", descriptor);
    });
  }

  test("should be false until the target scrolls", () => {
    const { result } = renderHook(() => useIsScrolling(createElement()));
    expect(result.current).toBe(false);
  });

  test("should be false without a target", () => {
    const { result } = renderHook(() => useIsScrolling(null));
    expect(result.current).toBe(false);
  });

  test("should reset after a delay in browsers that don't support scrollend", async () => {
    simulateNoScrollEndSupport();
    expect("onscrollend" in window).toBe(false);

    const target = createElement();
    const { result } = renderHook(() => useIsScrolling(target, { delay: 25 }));

    act(() => {
      target.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    await waitFor(() => expect(result.current).toBe(false));
  });

  test("should reset when the scrollend event fires", () => {
    expect("onscrollend" in window).toBe(true);

    const target = createElement();
    const { result } = renderHook(() =>
      // A long delay ensures that scrollend (not the timer) resets the value
      useIsScrolling(target, { delay: 60_000 })
    );

    act(() => {
      target.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    act(() => {
      target.dispatchEvent(new Event("scrollend"));
    });
    expect(result.current).toBe(false);
  });

  test("should support the window", () => {
    expect("onscrollend" in window).toBe(true);

    const { result } = renderHook(() => useIsScrolling("window"));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("scrollend"));
    });
    expect(result.current).toBe(false);
  });

  test("should reset when the target changes", () => {
    const first = createElement();
    const second = document.createElement("div");

    const { rerender, result } = renderHook(
      ({ target }) => useIsScrolling(target),
      { initialProps: { target: first } }
    );

    act(() => {
      first.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    rerender({ target: second });
    expect(result.current).toBe(false);

    // The previous target is no longer observed
    act(() => {
      first.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });
});
