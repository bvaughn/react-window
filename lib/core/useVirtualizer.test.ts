import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { EMPTY_OBJECT, NOOP_FUNCTION } from "../../src/constants";
import { setDefaultElementSize } from "../utils/test/mockResizeObserver";
import { useVirtualizer } from "./useVirtualizer";

describe("useVirtualizer", () => {
  const DEFAULT_ARGS: Parameters<typeof useVirtualizer>[0] = {
    containerElement: document.body,
    defaultContainerSize: 100,
    direction: "vertical",
    itemCount: 25,
    itemProps: EMPTY_OBJECT,
    itemSize: 25,
    onResize: NOOP_FUNCTION,
    overscanCount: 0
  };

  beforeEach(() => {
    setDefaultElementSize({
      height: 100,
      width: 50
    });
  });

  describe("getCellBounds", () => {
    test("itemSize type: number", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize: 25
        })
      );
      expect(result.current.getCellBounds(0)).toEqual({
        scrollOffset: 0,
        size: 25
      });
      expect(result.current.getCellBounds(24)).toEqual({
        scrollOffset: 600,
        size: 25
      });
    });

    test("itemSize type: string", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize: "50%"
        })
      );
      expect(result.current.getCellBounds(0)).toEqual({
        scrollOffset: 0,
        size: 50
      });
      expect(result.current.getCellBounds(24)).toEqual({
        scrollOffset: 1200,
        size: 50
      });
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemCount: 10,
          itemSize
        })
      );
      expect(result.current.getCellBounds(0)).toEqual({
        scrollOffset: 0,
        size: 20
      });
      expect(result.current.getCellBounds(9)).toEqual({
        scrollOffset: 900,
        size: 200
      });
    });
  });

  describe("getEstimatedSize", () => {
    test("itemSize type: number", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize: 25
        })
      );
      expect(result.current.getEstimatedSize()).toBe(625);
    });

    test("itemSize type: string", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize: "50%"
        })
      );
      expect(result.current.getEstimatedSize()).toBe(1250);
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemCount: 10,
          itemSize
        })
      );

      // Actual size is 1,100
      // Based on the rows measured so far, the estimated size is 400
      expect(result.current.getEstimatedSize()).toBe(400);

      // Finish measuring the rows and the actual size should be returned now
      result.current.getCellBounds(9);
      expect(result.current.getEstimatedSize()).toBe(1100);
    });
  });

  // scrollToIndex is mostly covered by getOffsetForIndex tests

  describe("startIndex/stopIndex", () => {
    test("itemSize type: number", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize: 25,
          overscanCount: 2
        })
      );
      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(5);
      expect(result.current.stopIndexVisible).toBe(3);
    });

    test("itemSize type: string", () => {
      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          overscanCount: 2,
          itemSize: "50%"
        })
      );
      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(3);
      expect(result.current.stopIndexVisible).toBe(1);
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = renderHook(() =>
        useVirtualizer({
          ...DEFAULT_ARGS,
          defaultContainerSize: 100,
          itemSize,
          overscanCount: 2
        })
      );
      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(4);
      expect(result.current.stopIndexVisible).toBe(2);
    });
  });

  describe("jsdom", () => {
    test("should gracefully degrade if scrollTo method is missing", () => {
      // @ts-expect-error Testing
      HTMLElement.prototype.scrollTo = undefined;

      const { result } = renderHook(() => useVirtualizer(DEFAULT_ARGS));

      result.current.scrollToIndex({ containerScrollOffset: 0, index: 5 });
    });
  });
});
