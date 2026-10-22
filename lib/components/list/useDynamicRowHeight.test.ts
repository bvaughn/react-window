import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createElementInOtherWindow } from "../../utils/test/createElementInOtherWindow";
import { useDynamicRowHeight } from "./useDynamicRowHeight";
import { DATA_ATTRIBUTE_LIST_INDEX } from "../../core/itemIndex";
import { setElementSize } from "../../utils/test/mockResizeObserver";
import { NOOP_FUNCTION } from "../../../src/constants";

describe("useDynamicRowHeight", () => {
  describe("getAverageRowHeight", () => {
    test("does not include estimates read by getRowHeight", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );
      for (let index = 0; index < 250; index++) {
        expect(result.current.getRowHeight(index)).toBe(100);
      }
      act(() => {
        result.current.setRowHeight(0, 20);
        result.current.setRowHeight(1, 40);
      });
      expect(result.current.getAverageRowHeight()).toBe(30);
      expect(result.current.getRowHeight(200)).toBe(100);
      expect(result.current.getAverageRowHeight()).toBe(30);
    });

    test("ignores elements without a valid index", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );

      // e.g. a data-index attribute used for something else
      const element = document.createElement("div");
      element.setAttribute("data-index", "row-5");
      document.body.appendChild(element);

      act(() => {
        result.current.observeRowElements([element]);
        setElementSize({ element, height: 20, width: 100 });
      });

      expect(result.current.getAverageRowHeight()).toBe(100);
      element.remove();
    });

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

  describe("initialRowHeights", () => {
    test("supports an array of heights", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: [10, 20]
        })
      );

      expect(result.current.getRowHeight(0)).toBe(10);
      expect(result.current.getRowHeight(1)).toBe(20);
      expect(result.current.getRowHeight(2)).toBe(100);
      expect(result.current.getAverageRowHeight()).toBe(15);
    });

    test("supports a Map of heights", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: new Map([
            [5, 10],
            [10, 30]
          ])
        })
      );

      expect(result.current.getRowHeight(0)).toBe(100);
      expect(result.current.getRowHeight(5)).toBe(10);
      expect(result.current.getRowHeight(10)).toBe(30);
      expect(result.current.getAverageRowHeight()).toBe(20);
    });

    test("ignores invalid heights", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: new Map([
            [0, 10],
            [1, 0],
            [2, -10],
            [3, NaN],
            [4, Infinity]
          ])
        })
      );

      expect(result.current.getRowHeight(0)).toBe(10);
      expect(result.current.getRowHeight(1)).toBe(100);
      expect(result.current.getRowHeight(2)).toBe(100);
      expect(result.current.getRowHeight(3)).toBe(100);
      expect(result.current.getRowHeight(4)).toBe(100);
      expect(result.current.getAverageRowHeight()).toBe(10);

      const { result: arrayResult } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: [NaN, 20]
        })
      );

      expect(arrayResult.current.getRowHeight(0)).toBe(100);
      expect(arrayResult.current.getRowHeight(1)).toBe(20);
    });

    test("are replaced by measured heights", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: [10, 20]
        })
      );

      act(() => {
        result.current.setRowHeight(0, 50);
      });

      expect(result.current.getRowHeight(0)).toBe(50);
      expect(result.current.getRowHeight(1)).toBe(20);
    });

    test("are re-applied when key changes", () => {
      const { rerender, result } = renderHook(
        ({ initialRowHeights, key }) =>
          useDynamicRowHeight({
            defaultRowHeight: 100,
            initialRowHeights,
            key
          }),
        {
          initialProps: {
            initialRowHeights: [10],
            key: "a"
          }
        }
      );

      act(() => {
        result.current.setRowHeight(1, 50);
      });

      rerender({ initialRowHeights: [10], key: "a" });
      expect(result.current.getRowHeight(1)).toBe(50);

      rerender({ initialRowHeights: [30], key: "b" });
      expect(result.current.getRowHeight(0)).toBe(30);
      expect(result.current.getRowHeight(1)).toBe(100);
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

  test("observes rows using the ResizeObserver from their own window", () => {
    const { disconnect, element, observe, unobserve } =
      createElementInOtherWindow();

    const { result, unmount } = renderHook(() =>
      useDynamicRowHeight({ defaultRowHeight: 100 })
    );

    let unobserveRows: () => void = NOOP_FUNCTION;
    act(() => {
      unobserveRows = result.current.observeRowElements([element]);
    });

    expect(observe).toHaveBeenCalledWith(element);

    unobserveRows();

    expect(unobserve).toHaveBeenCalledWith(element);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });

  test("replaces the observer if rows move to another window", () => {
    const { disconnect, element, observe } = createElementInOtherWindow();

    const mainWindowElement = document.createElement("div");
    mainWindowElement.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, "0");

    const { result } = renderHook(() =>
      useDynamicRowHeight({ defaultRowHeight: 100 })
    );

    act(() => {
      result.current.observeRowElements([element]);
    });

    expect(observe).toHaveBeenCalledWith(element);
    expect(disconnect).not.toHaveBeenCalled();

    act(() => {
      result.current.observeRowElements([mainWindowElement]);
    });

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  test("falls back to the global ResizeObserver if a row's window lacks one", () => {
    const { element, otherWindow } = createElementInOtherWindow();
    // @ts-expect-error Simulate API being unsupported in the other window
    otherWindow.ResizeObserver = undefined;
    element.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, "0");

    const { result } = renderHook(() =>
      useDynamicRowHeight({ defaultRowHeight: 100 })
    );

    act(() => {
      result.current.observeRowElements([element]);
    });

    act(() => {
      setElementSize({ element, height: 25, width: 50 });
    });

    // Observed by the (mocked) global ResizeObserver, as useResizeObserver does.
    // jsdom's mock reports on any element, so this doesn't show a real browser would measure it.
    expect(result.current.getRowHeight(0)).toBe(25);
  });

  // setRowHeight is tested indirectly by "getAverageRowHeight" and "getRowHeight" blocks above
});
