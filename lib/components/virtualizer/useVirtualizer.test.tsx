import { act, render, screen } from "@testing-library/react";
import { createRef, useImperativeHandle, useState, type Ref } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockLayout, mockWindowScroll } from "../../utils/test/mockLayout";
import {
  setDefaultElementSize,
  setElementSizeFunction
} from "../../utils/test/mockResizeObserver";
import { useDynamicRowHeight } from "../list/useDynamicRowHeight";
import type { Virtualizer, VirtualizerOptions } from "./types";
import { useVirtualizer } from "./useVirtualizer";

type Options = Omit<VirtualizerOptions, "element">;

function Example({
  virtualizerRef,
  ...options
}: Options & { virtualizerRef?: Ref<Virtualizer> }) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({ ...options, element });

  useImperativeHandle(virtualizerRef, () => virtualizer, [virtualizer]);

  return (
    <div data-testid="element" ref={setElement}>
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.items.map(({ index, offset, size }) => (
          <div
            data-index={index}
            data-testid="item"
            key={index}
            ref={virtualizer.measureElement}
            style={{ height: size, transform: `translateY(${offset}px)` }}
          >
            Item {index}
          </div>
        ))}
      </div>
    </div>
  );
}

function getRenderedItems() {
  return screen
    .queryAllByTestId("item")
    .map((item) => Number(item.getAttribute("data-index")));
}

describe("useVirtualizer", () => {
  beforeEach(() => {
    setDefaultElementSize({ height: 100, width: 100 });
  });

  test("should return the items that fill the element", () => {
    const virtualizerRef = createRef<Virtualizer>();

    render(
      <Example
        count={100}
        itemSize={25}
        overscanCount={0}
        virtualizerRef={virtualizerRef}
      />
    );

    expect(getRenderedItems()).toEqual([0, 1, 2, 3]);
    expect(virtualizerRef.current?.items[1]).toEqual({
      index: 1,
      offset: 25,
      size: 25
    });
    expect(virtualizerRef.current?.totalSize).toBe(2500);
    expect(virtualizerRef.current?.visibleRange).toEqual({
      startIndex: 0,
      stopIndex: 3
    });
  });

  test("should include overscan items", () => {
    render(<Example count={100} itemSize={25} overscanCount={2} />);

    expect(getRenderedItems()).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test("should update items when the element scrolls", () => {
    render(<Example count={100} itemSize={25} overscanCount={0} />);

    act(() => {
      const element = screen.getByTestId("element");
      element.scrollTop = 250;
      element.dispatchEvent(new Event("scroll"));
    });

    expect(getRenderedItems()).toEqual([10, 11, 12, 13]);
  });

  test("should support item size functions", () => {
    const virtualizerRef = createRef<Virtualizer>();
    const itemSize = (index: number) => (index + 1) * 10;

    render(
      <Example
        count={100}
        itemSize={itemSize}
        overscanCount={0}
        virtualizerRef={virtualizerRef}
      />
    );

    // 10 + 20 + 30 + 40 = 100
    expect(getRenderedItems()).toEqual([0, 1, 2, 3]);
    expect(virtualizerRef.current?.items[3]).toEqual({
      index: 3,
      offset: 60,
      size: 40
    });
  });

  test("should support percentage item sizes", () => {
    render(<Example count={100} itemSize="50%" overscanCount={0} />);

    expect(getRenderedItems()).toEqual([0, 1]);
  });

  test("should support horizontal content", () => {
    setDefaultElementSize({ height: 10, width: 100 });

    render(
      <Example
        count={100}
        direction="horizontal"
        itemSize={50}
        overscanCount={0}
      />
    );

    expect(getRenderedItems()).toEqual([0, 1]);
  });

  test("should call onItemsRendered", () => {
    const onItemsRendered = vi.fn();

    render(
      <Example
        count={100}
        itemSize={25}
        onItemsRendered={onItemsRendered}
        overscanCount={1}
      />
    );

    expect(onItemsRendered).toHaveBeenLastCalledWith(
      { startIndex: 0, stopIndex: 3 },
      { startIndex: 0, stopIndex: 4 }
    );
  });

  test("scrollToIndex should scroll the element", () => {
    const virtualizerRef = createRef<Virtualizer>();

    render(
      <Example
        count={100}
        itemSize={25}
        overscanCount={0}
        virtualizerRef={virtualizerRef}
      />
    );

    act(() => {
      virtualizerRef.current?.scrollToIndex({
        align: "start",
        behavior: "smooth",
        index: 50
      });
    });

    const scrollTo = vi.mocked(HTMLElement.prototype.scrollTo);
    expect(scrollTo.mock.contexts.at(-1)).toBe(screen.getByTestId("element"));
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      top: 1250
    });
    expect(getRenderedItems()).toEqual([50, 51, 52, 53]);

    expect(() => virtualizerRef.current?.scrollToIndex({ index: 100 })).toThrow(
      RangeError
    );
  });

  test("should support a scroll element", () => {
    const windowScroll = mockWindowScroll({ height: 100, width: 100 });
    mockLayout((element) => {
      if (element === document.documentElement) {
        return { height: 100, left: 0, top: 0, width: 100 };
      }
      if (element.getAttribute("data-testid") === "element") {
        return {
          height: 2500,
          left: 0,
          top: 200 - windowScroll.position.y,
          width: 100
        };
      }
    });

    const virtualizerRef = createRef<Virtualizer>();

    render(
      <Example
        count={100}
        itemSize={25}
        overscanCount={0}
        scrollElement="window"
        virtualizerRef={virtualizerRef}
      />
    );

    act(() => {
      window.scrollTo({ top: 250 });
    });
    expect(getRenderedItems()).toEqual([2, 3, 4, 5]);

    act(() => {
      virtualizerRef.current?.scrollToIndex({ align: "start", index: 20 });
    });
    expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
      behavior: "auto",
      top: 200 + 20 * 25
    });
  });

  describe("dynamic item sizes", () => {
    function DynamicExample({
      virtualizerRef
    }: {
      virtualizerRef?: Ref<Virtualizer>;
    }) {
      const itemSize = useDynamicRowHeight({ defaultRowHeight: 25 });
      return (
        <Example
          count={100}
          itemSize={itemSize}
          overscanCount={0}
          virtualizerRef={virtualizerRef}
        />
      );
    }

    test("should measure items passed to measureElement", () => {
      // Items measure 25px (the estimated size) unless specified;
      // setting the size function notifies observers of the new sizes
      const itemHeights = new Map<number, number>();
      const updateItemSizes = () =>
        setElementSizeFunction((element) => {
          if (element.getAttribute("data-testid") === "item") {
            const index = Number(element.getAttribute("data-index"));
            return new DOMRect(0, 0, 100, itemHeights.get(index) ?? 25);
          }
        });
      updateItemSizes();

      const virtualizerRef = createRef<Virtualizer>();

      render(<DynamicExample virtualizerRef={virtualizerRef} />);

      expect(getRenderedItems()).toEqual([0, 1, 2, 3]);

      act(() => {
        itemHeights.set(0, 70);
        updateItemSizes();
      });

      // The first item fills 70px; the next item's estimated 25px fill the rest
      expect(virtualizerRef.current?.items.slice(0, 2)).toEqual([
        { index: 0, offset: 0, size: 70 },
        { index: 1, offset: 70, size: 25 }
      ]);
      expect(getRenderedItems()).toEqual([0, 1, 2]);
    });

    test("should stop observing items that unmount", () => {
      const unobserve = vi.spyOn(ResizeObserver.prototype, "unobserve");

      render(<DynamicExample />);

      act(() => {
        const element = screen.getByTestId("element");
        element.scrollTop = 1000;
        element.dispatchEvent(new Event("scroll"));
      });

      const unobserved = unobserve.mock.calls.map(([element]) =>
        (element as Element).getAttribute("data-index")
      );
      expect(unobserved).toContain("0");
    });

    test("should warn about (and not measure) items without a valid data-index", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const observe = vi.spyOn(ResizeObserver.prototype, "observe");

      function ItemWithoutIndex() {
        const [element, setElement] = useState<HTMLDivElement | null>(null);
        const itemSize = useDynamicRowHeight({ defaultRowHeight: 25 });
        const { items, measureElement } = useVirtualizer({
          count: 10,
          element,
          itemSize
        });

        return (
          <div ref={setElement}>
            {items.map(({ index }) => (
              <div
                data-index={`row-${index}`}
                key={index}
                ref={measureElement}
              />
            ))}
          </div>
        );
      }

      const { rerender } = render(<ItemWithoutIndex />);
      rerender(<ItemWithoutIndex />);

      const observedItems = observe.mock.calls.filter(([element]) =>
        (element as Element).hasAttribute("data-index")
      );
      expect(observedItems).toHaveLength(0);

      // Once per element
      const renderedItems = document.querySelectorAll("[data-index]").length;
      expect(warn).toHaveBeenCalledTimes(renderedItems);
      expect(warn.mock.calls[0][0]).toContain("data-index");
    });

    test("should not support horizontal content", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      function HorizontalExample() {
        const itemSize = useDynamicRowHeight({ defaultRowHeight: 25 });
        return (
          <Example count={100} direction="horizontal" itemSize={itemSize} />
        );
      }

      expect(() => render(<HorizontalExample />)).toThrow(
        "Dynamic item sizes are only supported for vertical content"
      );
    });
  });
});
