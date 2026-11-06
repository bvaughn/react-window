import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { createElementInOtherWindow } from "../../utils/test/createElementInOtherWindow";
import {
  applyMeasurements,
  useDynamicRowHeight,
  type State
} from "./useDynamicRowHeight";
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

  describe("keys", () => {
    test("stores heights by key when one is provided", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );

      act(() => {
        result.current.setRowHeight(0, 15, "a");
        result.current.setRowHeight(1, 20, "b");
      });

      // Rows keep their heights when they move to another index
      expect(result.current.getRowHeight(5, "a")).toBe(15);
      expect(result.current.getRowHeight(0, "b")).toBe(20);
      expect(result.current.getRowHeight(0, "c")).toBe(100);
      // Heights stored by key aren't stored by index
      expect(result.current.getRowHeight(0)).toBe(100);
    });

    test("includes heights stored by key in the average", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );

      act(() => {
        result.current.setRowHeight(0, 20, "a");
        result.current.setRowHeight(1, 40);
      });
      expect(result.current.getAverageRowHeight()).toBe(30);
    });

    test("falls back to initial heights (by index) for rows that haven't been measured", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({
          defaultRowHeight: 100,
          initialRowHeights: [10, 20]
        })
      );

      expect(result.current.getRowHeight(1, "b")).toBe(20);
      act(() => {
        result.current.setRowHeight(1, 25, "b");
      });
      expect(result.current.getRowHeight(1, "b")).toBe(25);
    });

    test("resets when key changes", () => {
      const { result, rerender } = renderHook((key: string = "a") =>
        useDynamicRowHeight({ defaultRowHeight: 100, key })
      );

      act(() => {
        result.current.setRowHeight(0, 10, "row");
      });
      expect(result.current.getRowHeight(0, "row")).toBe(10);

      rerender("b");
      expect(result.current.getRowHeight(0, "row")).toBe(100);
    });

    test("stores measured heights by the key of the row at the time it's measured", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );

      const element = document.createElement("div");
      element.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, "0");
      let keys = ["a", "b"];

      act(() => {
        result.current.observeRowElements([element], {
          count: 2,
          getKey: (index) => keys[index]
        });
      });
      act(() => {
        setElementSize({ element, width: 100, height: 20 });
      });
      expect(result.current.getRowHeight(0, "a")).toBe(20);

      // A row was inserted before the observed one
      keys = ["c", "a"];
      element.setAttribute(DATA_ATTRIBUTE_LIST_INDEX, "1");
      act(() => {
        setElementSize({ element, width: 100, height: 30 });
      });
      expect(result.current.getRowHeight(1, "a")).toBe(30);
      expect(result.current.getRowHeight(0, "c")).toBe(100);
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

  describe("applyMeasurements", () => {
    function createState(): State {
      return {
        key: undefined,
        keyMap: new Map([["a", 10]]),
        map: new Map([[0, 10]])
      };
    }

    test("returns the previous state if nothing changed", () => {
      const state = createState();
      expect(
        applyMeasurements(
          state,
          [
            { index: 0, key: "a", size: 10 },
            { index: 0, key: undefined, size: 10 }
          ],
          undefined
        )
      ).toBe(state);
    });

    test("copies each map once for many measurements", () => {
      const state = createState();
      const keyMapIterator = vi.spyOn(state.keyMap, Symbol.iterator);

      const next = applyMeasurements(
        state,
        Array.from({ length: 20 }, (_, index) => ({
          index,
          key: `row-${index}`,
          size: 20
        })),
        undefined
      );
      expect(keyMapIterator).toHaveBeenCalledTimes(1);
      expect(next.keyMap.size).toBe(21);
      expect(next.map).toBe(state.map);
      // The previous state isn't changed
      expect(state.keyMap.size).toBe(1);
    });
  });

  describe("removing heights of rows that are no longer in the list", () => {
    test("removes them once the cache is much larger than the list", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );
      act(() => {
        result.current.observeRowElements([], {
          count: 10,
          getKey: (index) => `row-${index}`
        });
      });

      act(() => {
        result.current.setRowHeight(3, 30, "row-3");
        // 1,000 heights in all (the most that isn't pruned)
        for (let index = 0; index < 999; index++) {
          result.current.setRowHeight(index, 20, `removed-${index}`);
        }
      });
      // Not yet (the cache is small)
      expect(result.current.getRowHeight(0, "removed-0")).toBe(20);

      act(() => {
        result.current.setRowHeight(4, 40, "row-4");
      });
      expect(result.current.getRowHeight(0, "removed-0")).toBe(100);
      expect(result.current.getRowHeight(998, "removed-998")).toBe(100);
      // Rows in the list keep their heights
      expect(result.current.getRowHeight(3, "row-3")).toBe(30);
      expect(result.current.getRowHeight(4, "row-4")).toBe(40);
    });

    test("keeps heights of rows that are hidden for a while (e.g. by a filter)", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );
      act(() => {
        result.current.observeRowElements([], {
          count: 2000,
          getKey: (index) => `row-${index}`
        });
      });
      act(() => {
        for (let index = 0; index < 2000; index++) {
          result.current.setRowHeight(index, 20, `row-${index}`);
        }
      });

      // Only 10 rows match the filter
      act(() => {
        result.current.observeRowElements([], {
          count: 10,
          getKey: (index) => `row-${index}`
        });
      });
      act(() => {
        result.current.setRowHeight(0, 30, "row-0");
      });
      expect(result.current.getRowHeight(1999, "row-1999")).toBe(20);
    });

    test("removes heights once the cache is much larger than the most rows the list has had", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );
      act(() => {
        result.current.observeRowElements([], {
          count: 600,
          getKey: (index) => `row-${index}`
        });
      });
      act(() => {
        result.current.observeRowElements([], {
          count: 10,
          getKey: (index) => `row-${index}`
        });
      });

      // 1,200 heights in all (twice the most rows the list has had) isn't pruned
      act(() => {
        for (let index = 0; index < 1200; index++) {
          result.current.setRowHeight(index, 20, `removed-${index}`);
        }
      });
      expect(result.current.getRowHeight(0, "removed-0")).toBe(20);

      act(() => {
        result.current.setRowHeight(0, 30, "row-0");
      });
      expect(result.current.getRowHeight(0, "removed-0")).toBe(100);
      expect(result.current.getRowHeight(0, "row-0")).toBe(30);
    });

    test("doesn't remove heights without the list's keys", () => {
      const { result } = renderHook(() =>
        useDynamicRowHeight({ defaultRowHeight: 100 })
      );

      act(() => {
        for (let index = 0; index <= 1000; index++) {
          result.current.setRowHeight(index, 20, `row-${index}`);
        }
      });
      expect(result.current.getRowHeight(0, "row-0")).toBe(20);
    });
  });
});
