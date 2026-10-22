import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../src/constants";
import { Grid } from "./components/grid/Grid";
import type {
  CellComponentProps,
  GridImperativeAPI
} from "./components/grid/types";
import { List } from "./components/list/List";
import type {
  ListImperativeAPI,
  RowComponentProps
} from "./components/list/types";
import { assert } from "./utils/assert";
import { mockLayout, mockWindowScroll } from "./utils/test/mockLayout";
import { mockScrollPadding } from "./utils/test/mockScrollPadding";
import { setDefaultElementSize } from "./utils/test/mockResizeObserver";

function Row({ ariaAttributes, index, style }: RowComponentProps<object>) {
  return (
    <div {...ariaAttributes} style={style}>
      Row {index}
    </div>
  );
}

function Cell({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps<object>) {
  return (
    <div {...ariaAttributes} style={style}>
      Cell {rowIndex},{columnIndex}
    </div>
  );
}

function getRenderedRows() {
  return screen
    .queryAllByRole("listitem")
    .map((item) => item.textContent?.replace("Row ", ""))
    .map(Number);
}

function getRenderedCells() {
  return screen.queryAllByRole("gridcell").map((item) => item.textContent);
}

describe("scrollElement", () => {
  beforeEach(() => {
    setDefaultElementSize({ height: 0, width: 0 });
  });

  describe("List", () => {
    describe('"window"', () => {
      // A 100px tall viewport; the list starts 200px down the page
      const LIST_PAGE_TOP = 200;
      const ROW_HEIGHT = 25;
      const ROW_COUNT = 100;

      function setup() {
        const windowScroll = mockWindowScroll({ height: 100, width: 50 });

        mockLayout((element) => {
          if (element === document.documentElement) {
            return {
              height: 100,
              left: 0,
              scrollHeight: LIST_PAGE_TOP + ROW_HEIGHT * ROW_COUNT,
              top: 0,
              width: 50
            };
          }
          if (element.getAttribute("role") === "list") {
            return {
              height: ROW_HEIGHT * ROW_COUNT,
              left: 0,
              top: LIST_PAGE_TOP - windowScroll.position.y,
              width: 50
            };
          }
        });

        return windowScroll;
      }

      test("should render the rows visible within the window", () => {
        const windowScroll = setup();

        render(
          <List
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        // The list starts below the viewport
        expect(getRenderedRows()).toEqual([0]);

        act(() => {
          window.scrollTo({ top: 250 });
        });

        // The top 50px of the list are above the viewport
        expect(getRenderedRows()).toEqual([2, 3, 4, 5]);

        act(() => {
          windowScroll.position.y = 175;
          window.dispatchEvent(new Event("scroll"));
        });

        // The list starts 25px down the viewport
        expect(getRenderedRows()).toEqual([0, 1, 2]);
      });

      test("should render at its full height without scrolling itself", () => {
        setup();

        render(
          <List
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        const list = screen.getByRole("list");
        expect(list.style.overflowY).toBe("");
        expect(list.style.maxHeight).toBe("");
      });

      test("should re-measure when the list's position changes", () => {
        let listTop = LIST_PAGE_TOP;

        mockWindowScroll({ height: 100, width: 50 });
        mockLayout((element) => {
          if (element === document.documentElement) {
            return { height: 100, left: 0, top: 0, width: 50 };
          }
          if (element.getAttribute("role") === "list") {
            return {
              height: ROW_HEIGHT * ROW_COUNT,
              left: 0,
              top: listTop,
              width: 50
            };
          }
        });

        const { rerender } = render(
          <List
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );
        expect(getRenderedRows()).toEqual([0]);

        // e.g. content above the list was removed
        listTop = -100;
        rerender(
          <List
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );
        expect(getRenderedRows()).toEqual([4, 5, 6, 7]);
      });

      test("should use defaultHeight as the viewport height until measured", () => {
        render(
          <List
            defaultHeight={50}
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement={null}
          />
        );

        expect(getRenderedRows()).toEqual([0, 1]);
      });

      test("should size percentage rows relative to the viewport", () => {
        setup();

        render(
          <List
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight="50%"
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        act(() => {
          window.scrollTo({ top: 200 });
        });

        expect(getRenderedRows()).toEqual([0, 1]);
        expect(screen.getAllByRole("listitem")[1].style.height).toBe("50px");
      });

      test("should ignore defaultScrollOffset", () => {
        const windowScroll = setup();

        render(
          <List
            defaultScrollOffset={500}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        expect(windowScroll.scrollTo).not.toHaveBeenCalled();
        expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();
      });

      test("scrollToRow should scroll the window", () => {
        const windowScroll = setup();
        const listRef = createRef<ListImperativeAPI>();

        render(
          <List
            listRef={listRef}
            overscanCount={0}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        act(() => {
          listRef.current?.scrollToRow({ align: "start", index: 10 });
        });
        expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
          behavior: "auto",
          top: LIST_PAGE_TOP + 10 * ROW_HEIGHT
        });
        expect(getRenderedRows()).toEqual([10, 11, 12, 13]);

        act(() => {
          listRef.current?.scrollToRow({
            align: "end",
            behavior: "smooth",
            index: 20
          });
        });
        expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
          behavior: "smooth",
          top: LIST_PAGE_TOP + 21 * ROW_HEIGHT - 100
        });

        // Centering the first row reveals content above the list (rather than clamping to the list's start)
        act(() => {
          listRef.current?.scrollToRow({ align: "center", index: 0 });
        });
        expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
          behavior: "auto",
          top: LIST_PAGE_TOP + ROW_HEIGHT / 2 - 50
        });

        // Visible rows aren't scrolled to, even when the list doesn't start at the top of the viewport
        windowScroll.scrollTo.mockClear();
        act(() => {
          listRef.current?.scrollToRow({ index: 1 });
        });
        expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
          behavior: "auto",
          top: windowScroll.position.y
        });
        expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();
      });

      test("should throw a meaningful error for an invalid index", () => {
        setup();
        const listRef = createRef<ListImperativeAPI>();

        render(
          <List
            listRef={listRef}
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        expect(() =>
          listRef.current?.scrollToRow({ index: ROW_COUNT })
        ).toThrow(RangeError);
      });

      test("should remove listeners on unmount", () => {
        setup();
        const removeEventListener = vi.spyOn(window, "removeEventListener");

        const { unmount } = render(
          <List
            rowComponent={Row}
            rowCount={ROW_COUNT}
            rowHeight={ROW_HEIGHT}
            rowProps={EMPTY_OBJECT}
            scrollElement="window"
          />
        );

        unmount();

        const events = removeEventListener.mock.calls.map(([type]) => type);
        expect(events).toContain("scroll");
        expect(events).toContain("resize");
      });
    });

    describe("HTMLElement", () => {
      test("should render the rows visible within the scroll element", () => {
        const scroller = document.createElement("div");
        document.body.appendChild(scroller);

        // A 100px tall scroll element at the top of the page, with 300px of content above the list
        mockLayout((element) => {
          if (element === scroller) {
            return { height: 100, left: 0, top: 0, width: 50 };
          }
          if (element.getAttribute("role") === "list") {
            return {
              height: 2500,
              left: 0,
              top: 300 - scroller.scrollTop,
              width: 50
            };
          }
        });

        const listRef = createRef<ListImperativeAPI>();

        const { unmount } = render(
          <List
            listRef={listRef}
            overscanCount={0}
            rowComponent={Row}
            rowCount={100}
            rowHeight={25}
            rowProps={EMPTY_OBJECT}
            scrollElement={scroller}
          />,
          { container: scroller }
        );

        expect(getRenderedRows()).toEqual([0]);

        act(() => {
          scroller.scrollTop = 320;
          scroller.dispatchEvent(new Event("scroll"));
        });

        expect(getRenderedRows()).toEqual([0, 1, 2, 3, 4]);

        act(() => {
          listRef.current?.scrollToRow({ align: "start", index: 50 });
        });

        const scrollTo = vi.mocked(HTMLElement.prototype.scrollTo);
        expect(scrollTo).toHaveBeenCalledTimes(1);
        expect(scrollTo.mock.contexts[0]).toBe(scroller);
        expect(scrollTo).toHaveBeenLastCalledWith({
          behavior: "auto",
          top: 300 + 50 * 25
        });
        expect(getRenderedRows()).toEqual([50, 51, 52, 53]);

        unmount();
        scroller.remove();
      });
    });
  });

  describe("Grid", () => {
    // A 100x100 viewport; the grid starts 200px down the page
    const GRID_PAGE_TOP = 200;
    const SIZE = 25;
    const COUNT = 100;

    function setup({ gridClientWidth }: { gridClientWidth?: number } = {}) {
      const windowScroll = mockWindowScroll({ height: 100, width: 100 });

      mockLayout((element) => {
        if (element === document.documentElement) {
          return {
            height: 100,
            left: 0,
            scrollHeight: GRID_PAGE_TOP + SIZE * COUNT,
            scrollWidth: SIZE * COUNT,
            top: 0,
            width: 100
          };
        }
        if (element.getAttribute("role") === "grid") {
          const width = gridClientWidth ?? SIZE * COUNT;
          return {
            height: SIZE * COUNT,
            left: -windowScroll.position.x,
            scrollWidth: SIZE * COUNT,
            top: GRID_PAGE_TOP - windowScroll.position.y,
            width
          };
        }
      });

      return windowScroll;
    }

    test("should render the cells visible within the window (both axes)", () => {
      setup();

      render(
        <Grid
          cellComponent={Cell}
          cellProps={EMPTY_OBJECT}
          columnCount={COUNT}
          columnWidth={SIZE}
          overscanCount={0}
          rowCount={COUNT}
          rowHeight={SIZE}
          scrollElement="window"
        />
      );

      act(() => {
        window.scrollTo({ left: 1000, top: 250 });
      });

      expect(getRenderedCells()).toContain("Cell 2,40");
      expect(getRenderedCells()).toContain("Cell 5,43");
      expect(getRenderedCells()).toHaveLength(16);
    });

    test("should support columns that scroll within the grid", () => {
      const windowScroll = setup({ gridClientWidth: 100 });
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={Cell}
          cellProps={EMPTY_OBJECT}
          columnCount={COUNT}
          columnWidth={SIZE}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={COUNT}
          rowHeight={SIZE}
          scrollElement="window"
        />
      );

      const grid = screen.getByRole("grid");
      expect(grid.style.overflow).toBe("auto");
      expect(grid.style.maxHeight).toBe("");
      expect(grid.style.maxWidth).toBe("");

      act(() => {
        window.scrollTo({ top: 250 });
        grid.scrollLeft = 500;
        grid.dispatchEvent(new Event("scroll"));
      });

      expect(getRenderedCells()).toContain("Cell 2,20");
      expect(getRenderedCells()).toContain("Cell 5,23");
      expect(getRenderedCells()).toHaveLength(16);

      windowScroll.scrollTo.mockClear();
      act(() => {
        gridRef.current?.scrollToCell({
          columnAlign: "start",
          columnIndex: 50,
          rowAlign: "start",
          rowIndex: 50
        });
      });

      // Columns scroll the grid, rows scroll the window
      const elementScrollTo = vi.mocked(HTMLElement.prototype.scrollTo);
      expect(elementScrollTo.mock.contexts.at(-1)).toBe(grid);
      expect(elementScrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        left: 50 * SIZE
      });
      expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: GRID_PAGE_TOP + 50 * SIZE
      });
      expect(getRenderedCells()).toContain("Cell 50,50");
    });

    test("scrollToCell should scroll the window once if it scrolls both axes", () => {
      const windowScroll = setup();
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={Cell}
          cellProps={EMPTY_OBJECT}
          columnCount={COUNT}
          columnWidth={SIZE}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={COUNT}
          rowHeight={SIZE}
          scrollElement="window"
        />
      );

      act(() => {
        gridRef.current?.scrollToCell({
          columnAlign: "start",
          columnIndex: 10,
          rowAlign: "start",
          rowIndex: 10
        });
      });

      expect(windowScroll.scrollTo).toHaveBeenCalledTimes(1);
      expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        left: 10 * SIZE,
        top: GRID_PAGE_TOP + 10 * SIZE
      });
      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();
    });

    test("should support RTL columns that scroll with the window", () => {
      const windowScroll = mockWindowScroll({ height: 100, width: 100 });
      const gridRef = createRef<GridImperativeAPI>();

      // An RTL page starts scrolled to its right edge; scrollX is negative as the page scrolls left
      mockLayout((element) => {
        if (element === document.documentElement) {
          return { height: 100, left: 0, top: 0, width: 100 };
        }
        if (element.getAttribute("role") === "grid") {
          return {
            height: SIZE * COUNT,
            left: 100 - SIZE * COUNT - windowScroll.position.x,
            top: 0,
            width: SIZE * COUNT
          };
        }
      });

      render(
        <Grid
          cellComponent={Cell}
          cellProps={EMPTY_OBJECT}
          columnCount={COUNT}
          columnWidth={SIZE}
          dir="rtl"
          gridRef={gridRef}
          overscanCount={0}
          rowCount={1}
          rowHeight={SIZE}
          scrollElement="window"
        />
      );

      expect(getRenderedCells()).toEqual([
        "Cell 0,0",
        "Cell 0,1",
        "Cell 0,2",
        "Cell 0,3"
      ]);

      act(() => {
        window.scrollTo({ left: -500 });
      });

      expect(getRenderedCells()).toEqual([
        "Cell 0,20",
        "Cell 0,21",
        "Cell 0,22",
        "Cell 0,23"
      ]);

      act(() => {
        gridRef.current?.scrollToColumn({ align: "start", index: 40 });
      });

      expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        left: -40 * SIZE
      });
      expect(getRenderedCells()).toContain("Cell 0,40");
    });
  });

  describe("scroll-padding", () => {
    test("should align rows within the list's scroll padding", () => {
      setDefaultElementSize({ height: 100, width: 50 });
      mockScrollPadding((element) =>
        element.getAttribute("role") === "list"
          ? { scrollPaddingBottom: "20px", scrollPaddingTop: "30px" }
          : undefined
      );

      const listRef = createRef<ListImperativeAPI>();
      render(
        <List
          listRef={listRef}
          rowComponent={Row}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      const scrollTo = vi.mocked(HTMLElement.prototype.scrollTo);

      // Below the (e.g. sticky header) padding
      act(() => {
        listRef.current?.scrollToRow({ align: "start", index: 10 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 10 * 25 - 30
      });

      // Above the bottom padding
      act(() => {
        listRef.current?.scrollToRow({ align: "end", index: 20 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 21 * 25 - 100 + 20
      });

      // A row underneath the top padding isn't considered visible
      act(() => {
        const list = screen.getByRole("list");
        list.scrollTop = 10 * 25;
        list.dispatchEvent(new Event("scroll"));
      });
      act(() => {
        listRef.current?.scrollToRow({ index: 10 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 10 * 25 - 30
      });

      // Offsets are still clamped to the list's scrollable range
      act(() => {
        listRef.current?.scrollToRow({ align: "start", index: 0 });
      });
      expect(scrollTo).toHaveBeenLastCalledWith({ behavior: "auto", top: 0 });
    });

    test("should align rows within the window's scroll padding", () => {
      const windowScroll = mockWindowScroll({ height: 100, width: 50 });
      mockLayout((element) => {
        if (element === document.documentElement) {
          return { height: 100, left: 0, top: 0, width: 50 };
        }
        if (element.getAttribute("role") === "list") {
          return {
            height: 2500,
            left: 0,
            top: 200 - windowScroll.position.y,
            width: 50
          };
        }
      });
      mockScrollPadding((element) =>
        element === document.documentElement
          ? { scrollPaddingTop: "50px" }
          : undefined
      );

      const listRef = createRef<ListImperativeAPI>();
      render(
        <List
          listRef={listRef}
          rowComponent={Row}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
          scrollElement="window"
        />
      );

      act(() => {
        listRef.current?.scrollToRow({ align: "start", index: 10 });
      });
      expect(windowScroll.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 200 + 10 * 25 - 50
      });
    });
  });

  test("should not affect lists without a scroll element", () => {
    setDefaultElementSize({ height: 100, width: 50 });

    render(
      <List
        rowComponent={Row}
        rowCount={100}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    const list = screen.getByRole("list");
    assert(list !== null);
    expect(list.style.overflowY).toBe("auto");
    expect(list.style.maxHeight).toBe("100%");
  });
});
