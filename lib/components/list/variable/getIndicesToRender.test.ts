import { describe, expect, test } from "vitest";
import { getIndicesToRender } from "./getIndicesToRender";

describe("getIndicesToRender", () => {
  const rowHeight = () => 25;

  test("empty list", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 0,
        rowHeight,
        rowProps: {},
        scrollTop: 0,
      }),
    ).toEqual([0, -1]);
  });

  test("not enough rows to fill available height", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 2,
        rowHeight,
        rowProps: {},
        scrollTop: 0,
      }),
    ).toEqual([0, 1]);
  });

  test("initial set of rows", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 10,
        rowHeight,
        rowProps: {},
        scrollTop: 0,
      }),
    ).toEqual([0, 3]);
  });

  test("middle set of list", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 10,
        rowHeight,
        rowProps: {},
        scrollTop: 100,
      }),
    ).toEqual([4, 7]);
  });

  test("final set of rows", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 10,
        rowHeight,
        rowProps: {},
        scrollTop: 150,
      }),
    ).toEqual([6, 9]);
  });

  test("should not under-scroll", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 10,
        rowHeight,
        rowProps: {},
        scrollTop: -50,
      }),
    ).toEqual([0, 1]);
  });

  test("should not over-scroll", () => {
    expect(
      getIndicesToRender({
        cachedBounds: new Map(),
        height: 100,
        rowCount: 10,
        rowHeight,
        rowProps: {},
        scrollTop: 200,
      }),
    ).toEqual([8, 9]);
  });

  // TODO Test overscanCount
});
