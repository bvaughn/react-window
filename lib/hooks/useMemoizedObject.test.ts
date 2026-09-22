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

test("changing prop names with identical values updates the props", () => {
  const { result, rerender } = renderHook(
    (props: object) => useMemoizedObject(props),
    { initialProps: { a: 1 } as object }
  );
  rerender({ b: 1 });
  expect(result.current).toEqual({ b: 1 });
});

test("adding an optional prop updates the props", () => {
  const { result, rerender } = renderHook(
    (props: object) => useMemoizedObject(props),
    { initialProps: { a: 1 } as object }
  );
  rerender({ a: 1, b: 2 });
  expect(result.current).toEqual({ a: 1, b: 2 });
});

test("removes optional props and compares undefined-valued keys", () => {
  const { result, rerender } = renderHook(
    (props: object) => useMemoizedObject(props),
    { initialProps: { a: 1, b: undefined } as object }
  );
  rerender({ a: 1, c: undefined });
  expect(result.current).toEqual({ a: 1, c: undefined });
  rerender({ a: 1 });
  expect(result.current).toEqual({ a: 1 });
  const previous = result.current;
  rerender({ a: 1 });
  expect(result.current).toBe(previous);
});
