import { expect, test } from "vitest";
import { useItemSize } from "./useItemSize";

test("fractional percentage sizes are preserved", () => {
  expect(useItemSize({ containerSize: 1000, itemSize: "0.5%" })).toBe(5);
});
