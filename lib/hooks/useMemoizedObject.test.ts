import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useMemoizedObject } from "./useMemoizedObject";

describe("useMemoizedObject", () => {
  test("should memoize", () => {
    const { result, rerender } = renderHook((props: object) =>
      useMemoizedObject({
        foo: 123,
        bar: "abc",
        ...props
      })
    );

    expect(result.current).toEqual({
      foo: 123,
      bar: "abc"
    });

    const initial = result.current;

    rerender({
      foo: 123,
      bar: "abc"
    });

    expect(result.current).toBe(initial);
  });

  test("should recreate object when a value changes", () => {
    const { result, rerender } = renderHook((props: object) =>
      useMemoizedObject({
        foo: 123,
        bar: "abc",
        ...props
      })
    );

    const initial = result.current;

    rerender({
      foo: 234,
      bar: "abc"
    });

    expect(result.current).not.toBe(initial);
    expect(result.current).toEqual({
      foo: 234,
      bar: "abc"
    });
  });
});
