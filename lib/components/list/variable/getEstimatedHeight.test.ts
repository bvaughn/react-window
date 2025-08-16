import { describe, expect, test } from "vitest";
import { getEstimatedHeight } from "./getEstimatedHeight";

describe("getEstimatedHeight", () => {
  test("should estimate the size based on the rows measured so far", () => {
    expect(
      getEstimatedHeight({
        cachedBounds: new Map([[0, { height: 25, scrollTop: 0 }]]),
        rowCount: 10,
      }),
    ).toBe(250);

    expect(
      getEstimatedHeight({
        cachedBounds: new Map([
          [0, { height: 20, scrollTop: 0 }],
          [1, { height: 10, scrollTop: 20 }],
        ]),
        rowCount: 10,
      }),
    ).toBe(150);
  });

  test("should return the actual size once all rows have been measured", () => {
    expect(
      getEstimatedHeight({
        cachedBounds: new Map([
          [0, { height: 20, scrollTop: 0 }],
          [1, { height: 10, scrollTop: 20 }],
          [2, { height: 5, scrollTop: 30 }],
        ]),
        rowCount: 3,
      }),
    ).toBe(35);
  });
});
