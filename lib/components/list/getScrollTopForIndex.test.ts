import { describe, expect, test } from "vitest";
import { getScrollTopForIndex } from "./getScrollTopForIndex";

describe("getScrollTopForIndex", () => {
  const getRowOffset = (index: number) => index * 10;
  const rowHeight = () => 10;

  describe("align:auto", () => {
    test("should not scroll if the row is already visible", () => {
      expect(
        getScrollTopForIndex({
          align: "auto",
          getRowOffset,
          height: 50,
          index: 0,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "auto",
          getRowOffset,
          height: 50,
          index: 4,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);
    });

    test("should scroll the minimum amount to show the list", () => {
      expect(
        getScrollTopForIndex({
          align: "auto",
          getRowOffset,
          height: 50,
          index: 5,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(10);

      expect(
        getScrollTopForIndex({
          align: "auto",
          getRowOffset,
          height: 50,
          index: 1,
          prevScrollTop: 20,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(10);
    });
  });

  describe("align:center", () => {
    test("should center align the row if possible", () => {
      expect(
        getScrollTopForIndex({
          align: "center",
          getRowOffset,
          height: 50,
          index: 5,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(30);
    });

    test("should gracefully handle a row near the beginning of the list", () => {
      expect(
        getScrollTopForIndex({
          align: "center",
          getRowOffset,
          height: 50,
          index: 0,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "center",
          getRowOffset,
          height: 50,
          index: 1,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);
    });

    test("should gracefully handle a row near the end of the list", () => {
      expect(
        getScrollTopForIndex({
          align: "center",
          getRowOffset,
          height: 50,
          index: 9,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);

      expect(
        getScrollTopForIndex({
          align: "center",
          getRowOffset,
          height: 50,
          index: 8,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);
    });
  });

  describe("align:end", () => {
    test("should align the row at the end/bottom of the list", () => {
      expect(
        getScrollTopForIndex({
          align: "end",
          getRowOffset,
          height: 50,
          index: 4,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "end",
          getRowOffset,
          height: 50,
          index: 9,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);
    });

    test("should gracefully handle when the row is too near the beginning of the list to align to the end", () => {
      expect(
        getScrollTopForIndex({
          align: "end",
          getRowOffset,
          height: 50,
          index: 0,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "end",
          getRowOffset,
          height: 50,
          index: 3,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);
    });
  });

  describe("align:smart", () => {
    test("should not scroll if the row is already visible", () => {
      expect(
        getScrollTopForIndex({
          align: "smart",
          getRowOffset,
          height: 50,
          index: 2,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "smart",
          getRowOffset,
          height: 50,
          index: 8,
          prevScrollTop: 50,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);
    });

    test("should center align the row if not already visible", () => {
      expect(
        getScrollTopForIndex({
          align: "smart",
          getRowOffset,
          height: 50,
          index: 5,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(30);
    });
  });

  describe("align:start", () => {
    test("should align the row at the start/top of the list", () => {
      expect(
        getScrollTopForIndex({
          align: "start",
          getRowOffset,
          height: 50,
          index: 0,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(0);

      expect(
        getScrollTopForIndex({
          align: "start",
          getRowOffset,
          height: 50,
          index: 5,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);
    });

    test("should gracefully handle when the row is too near the end of the list to align to the start", () => {
      expect(
        getScrollTopForIndex({
          align: "start",
          getRowOffset,
          height: 50,
          index: 9,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);

      expect(
        getScrollTopForIndex({
          align: "start",
          getRowOffset,
          height: 50,
          index: 7,
          prevScrollTop: 0,
          rowCount: 10,
          rowHeight,
        }),
      ).toBe(50);
    });
  });
});
