import { describe, expect, test } from "vitest";
import { parseNumericStyleValue } from "./parseNumericStyleValue";

describe("parseNumericStyleValue", () => {
  test("should handle undefined styles", () => {
    expect(parseNumericStyleValue(undefined)).toBe(undefined);
  });

  test("should return numeric styles", () => {
    expect(parseNumericStyleValue(20)).toBe(20);
    expect(parseNumericStyleValue(10.5)).toBe(10.5);
  });

  test("should parse string pixels styles", () => {
    expect(parseNumericStyleValue("20px")).toBe(20);
    expect(parseNumericStyleValue("10.5px")).toBe(10.5);
  });

  test("should ignore string percentage styles", () => {
    expect(parseNumericStyleValue("100%")).toBe(undefined);
  });

  test("should ignore string relative styles", () => {
    expect(parseNumericStyleValue("1rem")).toBe(undefined);
    expect(parseNumericStyleValue("1em")).toBe(undefined);
    expect(parseNumericStyleValue("1vh")).toBe(undefined);
  });
});
