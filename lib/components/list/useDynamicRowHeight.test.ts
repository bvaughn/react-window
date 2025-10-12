import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useDynamicRowHeight } from "./useDynamicRowHeight";
import { DATA_ATTRIBUTE_LIST_INDEX } from "./List";
import { setElementSize } from "../../utils/test/mockResizeObserver";
import { NOOP_FUNCTION } from "../../../src/constants";

describe("useDynamicRowHeight", () => {
  describe("getAverageRowHeight", () => {
    test("returns an initial estimate based on the defaultRowHeight", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      expect(result.current.getAverageRowHeight()).toBe(100);
    });

    test("returns an estimate based on measured rows", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      act(() => {
        result.current.setRowHeight(0, 10);
        result.current.setRowHeight(1, 20);
      });
      expect(result.current.getAverageRowHeight()).toBe(15);

      act(() => {
        result.current.setRowHeight(2, 30);
      });
      expect(result.current.getAverageRowHeight()).toBe(20);

      act(() => {
        result.current.setRowHeight(2, 15);
      });
      expect(result.current.getAverageRowHeight()).toBe(15);
    });

    test("resets when key changes", () => {
      const { result, rerender } = renderHook((key: string = "a") =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          key
        })
      );

      act(() => {
        result.current.setRowHeight(0, 10);
      });
      expect(result.current.getAverageRowHeight()).toBe(10);

      rerender("a");
      expect(result.current.getAverageRowHeight()).toBe(10);

      rerender("b");
      expect(result.current.getAverageRowHeight()).toBe(100);
    });
  });

  describe("getRowHeight", () => {
    test("returns estimated height for a row that has not yet been measured", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      expect(result.current.getRowHeight(0)).toBe(100);
    });

    test("returns the most recently measured size", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      act(() => {
        result.current.setRowHeight(0, 15);
        result.current.setRowHeight(1, 20);
        result.current.setRowHeight(3, 25);
      });
      expect(result.current.getRowHeight(0)).toBe(15);
      expect(result.current.getRowHeight(1)).toBe(20);
      expect(result.current.getRowHeight(2)).toBe(100);
      expect(result.current.getRowHeight(3)).toBe(25);

      act(() => {
        result.current.setRowHeight(1, 25);
      });
      expect(result.current.getRowHeight(1)).toBe(25);
    });

    test("resets when key changes", () => {
      const { result, rerender } = renderHook((key: string = "a") =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          key
        })
      );

      act(() => {
        result.current.setRowHeight(0, 10);
      });
      expect(result.current.getRowHeight(0)).toBe(10);

      rerender("a");
      expect(result.current.getRowHeight(0)).toBe(10);

      rerender("b");
      expect(result.current.getRowHeight(0)).toBe(100);
    });
  });

  describe("observeRowElements", () => {
    function createRowElement(index: number) {
      const element = document.createElement("div");
      element.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, "" + index);
      return element;
    }

    test("should update cache when an observed element is resized", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      const elementA = createRowElement(0);
      const elementB = createRowElement(1);

      act(() => {
        result.current.observeRowElements([elementA, elementB]);
      });
      expect(result.current.getRowHeight(0)).toBe(100);
      expect(result.current.getRowHeight(1)).toBe(100);

      act(() => {
        setElementSize({
          element: elementB,
          width: 100,
          height: 20
        });
      });
      expect(result.current.getRowHeight(0)).toBe(100);
      expect(result.current.getRowHeight(1)).toBe(20);

      act(() => {
        setElementSize({
          element: elementA,
          width: 100,
          height: 15
        });
      });
      expect(result.current.getRowHeight(0)).toBe(15);
      expect(result.current.getRowHeight(1)).toBe(20);
    });

    test("should unobserve an element when requested", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100
        })
      );

      const element = createRowElement(0);

      let unobserve: () => void = NOOP_FUNCTION;

      act(() => {
        unobserve = result.current.observeRowElements([element]);

        setElementSize({
          element,
          width: 100,
          height: 10
        });
      });
      expect(result.current.getRowHeight(0)).toBe(10);

      act(() => {
        unobserve();

        setElementSize({
          element,
          width: 100,
          height: 20
        });
      });
      expect(result.current.getRowHeight(0)).toBe(10);
    });
  });

  // setRowHeight is tested indirectly by "getAverageRowHeight" and "getRowHeight" blocks above
});
