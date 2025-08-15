import { describe, expect, test } from "vitest";
import { getIndicesToRender } from "./getIndicesToRender";

describe("getIndicesToRender", () => {
  test("empty list", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 0,
        rowHeight: 25,
        scrollTop: 0,
      }),
    ).toEqual([0, -1]);
  });

  test("not enough rows to fill available height", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 2,
        rowHeight: 25,
        scrollTop: 0,
      }),
    ).toEqual([0, 1]);
  });

  test("initial set of rows", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 10,
        rowHeight: 25,
        scrollTop: 0,
      }),
    ).toEqual([0, 3]);
  });

  test("middle set of list", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 10,
        rowHeight: 25,
        scrollTop: 100,
      }),
    ).toEqual([4, 7]);
  });

  test("final set of rows", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 10,
        rowHeight: 25,
        scrollTop: 150,
      }),
    ).toEqual([6, 9]);
  });

  test("should not under-scroll", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 10,
        rowHeight: 25,
        scrollTop: -50,
      }),
    ).toEqual([0, 1]);
  });

  test("should not over-scroll", () => {
    expect(
      getIndicesToRender({
        height: 100,
        rowCount: 10,
        rowHeight: 25,
        scrollTop: 200,
      }),
    ).toEqual([8, 9]);
  });
});
