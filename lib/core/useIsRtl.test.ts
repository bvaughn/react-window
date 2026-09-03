import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useIsRtl } from "./useIsRtl";

describe("useIsRtl", () => {
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
