import { describe, expect, test } from "vitest";
import { shallowCompare } from "./shallowCompare";

describe("shallowCompare", () => {
  test("should respect shallow equality", () => {
    const value = {
      number: 1,
      string: "string",
      boolean: true,
      symbol: Symbol.for("symbol"),
      array: [1, 2, 3],
      object: { abc: 123 }
    };

    expect(shallowCompare(value, { ...value })).toBe(true);
  });

  test("should identify changes", () => {
    expect(
      shallowCompare(
        {
          foo: 1
        },
        { foo: 2 }
      )
    ).toBe(false);

    expect(
      shallowCompare(
        {
          foo: 1
        },
        { bar: 1 }
      )
    ).toBe(false);
  });
});
