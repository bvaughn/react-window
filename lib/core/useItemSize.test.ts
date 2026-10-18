import { expect, test } from "vitest";
import { useItemSize } from "./useItemSize";

test("fractional percentage sizes are preserved", () => {
  expect(useItemSize({ containerSize: 1000, itemSize: "0.5%" })).toBe(5);
});

test.each([
  { itemSize: "abc%", expected: 0 },
  { itemSize: "-10%", expected: 0 },
  { itemSize: "100%", expected: 1000 },
  { itemSize: -5, expected: 0 },
  { itemSize: NaN, expected: 0 },
  { itemSize: Infinity, expected: 0 }
])("normalizes item size $itemSize to $expected", ({ itemSize, expected }) => {
  expect(useItemSize({ containerSize: 1000, itemSize })).toBe(expected);
});
