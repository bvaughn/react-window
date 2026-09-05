import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useIsRtl } from "./useIsRtl";

describe("useIsRtl", () => {
  test("should read the DOM element's direction when no explicit prop provided", () => {
    const ltrElement = document.createElement("div");
    ltrElement.dir = "ltr";

    const rtlElement = document.createElement("div");
    rtlElement.dir = "rtl";

    const { result, rerender } = renderHook(
      (element: HTMLElement) => useIsRtl(element, undefined),
      { initialProps: ltrElement }
    );

    expect(result.current).toBe(false);

    rerender(rtlElement);
    expect(result.current).toBe(true);

    rerender(ltrElement);
    expect(result.current).toBe(false);
  });

  test("should update when an explicit direction changes", () => {
    const element = document.createElement("div");

    const { result, rerender } = renderHook(
      (dir: "ltr" | "rtl") => useIsRtl(element, dir),
      { initialProps: "ltr" as "ltr" | "rtl" }
    );

    expect(result.current).toBe(false);

    rerender("rtl");
    expect(result.current).toBe(true);

    rerender("ltr");
    expect(result.current).toBe(false);
  });
});
