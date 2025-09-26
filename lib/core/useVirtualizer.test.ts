import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { EMPTY_OBJECT, NOOP_FUNCTION } from "../../src/constants";
import {
  setDefaultElementSize,
  setElementSizeFunction
} from "../utils/test/mockResizeObserver";
import { useVirtualizer } from "./useVirtualizer";

describe("useVirtualizer", () => {
  type Params = Parameters<typeof useVirtualizer>[0];

  function testHelper(config: Partial<Params> = {}) {
    const containerElement = document.createElement("div");
    containerElement.setAttribute("role", "list");

    const args: Params = {
      containerElement,
      defaultContainerSize: 100,
      direction: "vertical",
      itemCount: 25,
      itemProps: EMPTY_OBJECT,
      itemSize: 25,
      onResize: NOOP_FUNCTION,
      overscanCount: 0,
      ...config
    };

    for (let index = 0; index < args.itemCount; index++) {
      const element = document.createElement("div");
      containerElement.appendChild(element);
    }

    return renderHook(() => useVirtualizer(args));
  }
  beforeEach(() => {
    setDefaultElementSize({ height: 100, width: 50 });

    setElementSizeFunction((element) => {
      if (element.getAttribute("role") === "list") {
        return new DOMRect(0, 0, 50, 100);
      } else {
        return new DOMRect(0, 0, 50, 25);
      }
    });
  });

  describe("cachedBounds", () => {
    test("itemSize type: number", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: 25
      });

      expect(result.current.cachedBounds.getItemBounds(0)).toEqual({
        scrollOffset: 0,
        size: 25
      });
      expect(result.current.cachedBounds.getItemBounds(24)).toEqual({
        scrollOffset: 600,
        size: 25
      });
    });

    test("itemSize type: string", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: "50%"
      });

      expect(result.current.cachedBounds.getItemBounds(0)).toEqual({
        scrollOffset: 0,
        size: 50
      });
      expect(result.current.cachedBounds.getItemBounds(24)).toEqual({
        scrollOffset: 1200,
        size: 50
      });
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = testHelper({
        defaultContainerSize: 100,
        itemCount: 10,
        itemSize
      });

      expect(result.current.cachedBounds.getItemBounds(0)).toEqual({
        scrollOffset: 0,
        size: 20
      });
      expect(result.current.cachedBounds.getItemBounds(9)).toEqual({
        scrollOffset: 900,
        size: 200
      });
    });

    test("itemSize type: undefined", () => {
      const { result } = testHelper({
        defaultContainerSize: 200,
        itemCount: 10,
        itemSize: undefined,
        uncachedItemSizeDefault: 50
      });

      // Default size returned by mock ResizeObserver
      expect(result.current.cachedBounds.getItemBounds(0)).toEqual({
        scrollOffset: 0,
        size: 25
      });

      // Not measured yet
      expect(result.current.cachedBounds.getItemBounds(9)).toEqual({
        scrollOffset: 225,
        size: 25
      });
    });
  });

  describe("getEstimatedSize", () => {
    test("itemSize type: number", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: 25
      });

      expect(result.current.getEstimatedSize()).toBe(625);
    });

    test("itemSize type: string", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: "50%"
      });

      expect(result.current.getEstimatedSize()).toBe(1250);
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = testHelper({
        defaultContainerSize: 100,
        itemCount: 10,
        itemSize
      });

      // Actual size is 1,100
      // Based on the rows measured so far, the estimated size is 400
      expect(result.current.getEstimatedSize()).toBe(400);

      // Finish measuring the rows and the actual size should be returned now
      result.current.cachedBounds.getItemBounds(9);
      expect(result.current.getEstimatedSize()).toBe(1100);
    });

    test("itemSize type: undefined", () => {
      setElementSizeFunction(() => new DOMRect(0, 0, 100, 35));

      const { result } = testHelper({
        defaultContainerSize: 100,
        itemCount: 10,
        itemSize: undefined
      });

      // Size calculated as an average of measured items
      expect(result.current.getEstimatedSize()).toBe(350);

      setElementSizeFunction(() => new DOMRect(0, 0, 100, 50));

      // Size should take into account the updated row heights
      expect(result.current.getEstimatedSize()).toBe(500);
    });
  });

  // The specific scroll index ranges are mostly covered by getOffsetForIndex tests

  describe("startIndex/stopIndex", () => {
    test("itemSize type: number", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: 25,
        overscanCount: 2
      });

      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(5);
      expect(result.current.stopIndexVisible).toBe(3);
    });

    test("itemSize type: string", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        overscanCount: 2,
        itemSize: "50%"
      });

      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(3);
      expect(result.current.stopIndexVisible).toBe(1);
    });

    test("itemSize type: function", () => {
      const itemSize = (index: number) => 20 + index * 20;

      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize,
        overscanCount: 2
      });

      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(4);
      expect(result.current.stopIndexVisible).toBe(2);
    });

    test("itemSize type: undefined", () => {
      const { result } = testHelper({
        defaultContainerSize: 100,
        itemSize: undefined,
        overscanCount: 2
      });

      expect(result.current.startIndexOverscan).toBe(0);
      expect(result.current.startIndexVisible).toBe(0);
      expect(result.current.stopIndexOverscan).toBe(5);
      expect(result.current.stopIndexVisible).toBe(3);
    });
  });

  describe("jsdom", () => {
    test("should gracefully degrade if scrollTo method is missing", () => {
      // @ts-expect-error Testing
      HTMLElement.prototype.scrollTo = undefined;

      const { result } = testHelper();

      result.current.scrollToIndex({ containerScrollOffset: 0, index: 5 });
    });
  });
});
