import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { useStableCallback } from "./useStableCallback";

describe("useStableCallback()", () => {
  test("should not call the callback during render", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useStableCallback(fn));

    render(<button onClick={result.current}>Click me</button>);

    expect(fn).not.toHaveBeenCalled();
  });

  test("should call the callback when the event is triggered", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useStableCallback(fn));

    render(<button onClick={result.current}>Click me</button>);

    fireEvent.click(screen.getByText("Click me"));

    expect(fn).toHaveBeenCalled();
  });
});
