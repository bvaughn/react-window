import { render, screen } from "@testing-library/react";
import { createRef, useLayoutEffect } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../../../src/constants";
import {
  disableResizeObserverForCurrentTest,
  setDefaultElementSize,
  simulateUnsupportedEnvironmentForTest
} from "../../utils/test/mockResizeObserver";
import { Grid } from "./Grid";
import type { CellComponentProps, GridImperativeAPI } from "./types";
import { useGridCallbackRef } from "./useGridCallbackRef";

describe("Grid", () => {
  let mountedCells: Map<string, CellComponentProps<object>> = new Map();

  const CellComponent = vi.fn(function Cell(props: CellComponentProps<object>) {
    const { ariaAttributes, columnIndex, rowIndex, style } = props;

    const key = `${rowIndex},${columnIndex}`;

    useLayoutEffect(() => {
      mountedCells.set(key, props);
      return () => {
        mountedCells.delete(key);
      };
    });

    return (
      <div {...ariaAttributes} style={style}>
        Cell {key}
      </div>
    );
  });

  beforeEach(() => {
    CellComponent.mockReset();

    setDefaultElementSize({ height: 40, width: 100 });

    mountedCells = new Map();
  });

  test("should render an empty Grid", () => {
    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={0}
        columnWidth={25}
        overscanCount={0}
        rowCount={0}
        rowHeight={20}
      />
    );

    const items = screen.queryAllByRole("gridcell");
    expect(items).toHaveLength(0);
  });

  test("should render extra cells for overscan", () => {
    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth={25}
        overscanCount={2}
        rowCount={100}
        rowHeight={20}
      />
    );

    // 4 columns (+2) by 2 rows (+2)
    const items = screen.queryAllByRole("gridcell");
    expect(items).toHaveLength(24);
  });

  describe("cell sizes", () => {
    test("type: number (px)", () => {
      const { container } = render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={25}
          overscanCount={0}
          rowCount={100}
          rowHeight={20}
        />
      );

      // 4 columns by 2 rows
      expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(8);
    });

    test("type: function (px)", () => {
      const columnWidth = () => 50;
      const rowHeight = () => 20;

      const { container } = render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={columnWidth}
          overscanCount={0}
          rowCount={100}
          rowHeight={rowHeight}
        />
      );

      // 2 columns by 2 rows
      expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(4);
    });

    test("type: string (%)", () => {
      const { container } = render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth="25%"
          overscanCount={0}
          rowCount={100}
          rowHeight="25%"
        />
      );

      // 4 columns by 4 rows
      expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(16);
    });
  });

  test("should pass cellProps to the cellComponent", () => {
    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          foo: "abc",
          bar: 123
        }}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="25%"
      />
    );

    expect(mountedCells.size).toEqual(8);
    expect(mountedCells.get("0,0")).toMatchObject({
      foo: "abc",
      bar: 123
    });
  });

  test("should re-render items if cellComponent changes", () => {
    const { rerender } = render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="25%"
      />
    );

    const NewCellComponent = vi.fn(() => <div />);

    rerender(
      <Grid
        cellComponent={NewCellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="25%"
      />
    );

    expect(NewCellComponent).toHaveBeenCalled();
  });

  test("should re-render items if cell size changes", () => {
    const { rerender } = render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="25%"
      />
    );
    expect(mountedCells).toHaveLength(8);

    rerender(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="50%"
      />
    );
    expect(mountedCells).toHaveLength(4);
  });

  test("should re-render items if cellProps change", () => {
    const { rerender } = render(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          foo: "abc"
        }}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="50%"
      />
    );
    expect(mountedCells).toHaveLength(4);
    expect(mountedCells.get("0,0")).toMatchObject({
      foo: "abc"
    });

    rerender(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          bar: 123
        }}
        columnCount={100}
        columnWidth="50%"
        overscanCount={0}
        rowCount={100}
        rowHeight="50%"
      />
    );
    expect(mountedCells).toHaveLength(4);
    expect(mountedCells.get("0,0")).toMatchObject({
      bar: 123
    });
  });

  test("should use default sizes for initial mount", () => {
    // Mimic server rendering
    disableResizeObserverForCurrentTest();

    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          bar: 123
        }}
        defaultHeight={100}
        defaultWidth={300}
        columnCount={100}
        columnWidth={75}
        overscanCount={0}
        rowCount={100}
        rowHeight={50}
      />
    );

    const items = screen.queryAllByRole("gridcell");
    expect(items).toHaveLength(8);
  });

  test("should call onCellsRendered", () => {
    const onCellsRendered = vi.fn();

    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth={25}
        onCellsRendered={onCellsRendered}
        overscanCount={2}
        rowCount={100}
        rowHeight={20}
      />
    );

    expect(onCellsRendered).toHaveBeenCalled();
    expect(onCellsRendered).toHaveBeenLastCalledWith(
      {
        columnStartIndex: 0,
        columnStopIndex: 3,
        rowStartIndex: 0,
        rowStopIndex: 1
      },
      {
        columnStartIndex: 0,
        columnStopIndex: 5,
        rowStartIndex: 0,
        rowStopIndex: 3
      }
    );
  });

  test("should support custom className and style props", () => {
    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        className="foo"
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
        style={{
          backgroundColor: "red"
        }}
      />
    );

    const grid = screen.queryByRole("grid");
    expect(grid).toHaveClass("foo");
    expect(grid?.style.backgroundColor).toBe("red");
  });

  test("should spread HTML rest attributes", () => {
    render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth={25}
        data-testid="foo"
        overscanCount={2}
        rowCount={100}
        rowHeight={20}
      />
    );

    expect(screen.queryByTestId("foo")).toHaveRole("grid");
  });

  test("custom tagName and attributes", () => {
    function CustomCellComponent({ style }: CellComponentProps<object>) {
      return <span style={style}>Cell</span>;
    }

    const { container } = render(
      <Grid
        cellComponent={CustomCellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
        tagName="main"
      />
    );

    expect(container.firstElementChild?.tagName).toBe("MAIN");
    expect(container.querySelectorAll("SPAN")).toHaveLength(8);
  });

  test("children", () => {
    const { container } = render(
      <Grid
        cellComponent={CellComponent}
        cellProps={EMPTY_OBJECT}
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
      >
        <div id="custom">Overlay or tooltip</div>
      </Grid>
    );

    expect(container.querySelector("#custom")).toHaveTextContent(
      "Overlay or tooltip"
    );
  });

  describe("imperative API", () => {
    test("should return the root element", () => {
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={25}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={100}
          rowHeight={20}
        />
      );

      expect(gridRef.current?.element).toEqual(screen.queryByRole("grid"));
    });

    test("should scroll to cell", () => {
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={25}
          columnWidth={25}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={25}
          rowHeight={20}
        />
      );
      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();

      gridRef.current?.scrollToCell({ columnIndex: 4, rowIndex: 8 });

      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1);
      expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        left: 25,
        top: 140
      });
    });

    test("should scroll to column", () => {
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={25}
          columnWidth={25}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={25}
          rowHeight={20}
        />
      );
      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();

      gridRef.current?.scrollToColumn({ index: 4 });

      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1);
      expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        left: 25
      });
    });

    test("should scroll to row", () => {
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={25}
          columnWidth={25}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={25}
          rowHeight={20}
        />
      );
      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();

      gridRef.current?.scrollToRow({ index: 8 });

      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1);
      expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 140
      });
    });

    test("should throw a meaningful error if an invalid index is passed to scrollToRow", () => {
      const gridRef = createRef<GridImperativeAPI>();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={25}
          columnWidth={25}
          gridRef={gridRef}
          overscanCount={0}
          rowCount={25}
          rowHeight={20}
        />
      );

      expect(() => {
        gridRef.current?.scrollToRow({ index: -1 });
      }).toThrowError("Invalid index specified: -1");

      expect(() => {
        gridRef.current?.scrollToRow({ index: 25 });
      }).toThrowError("Invalid index specified: 25");

      expect(() => {
        gridRef.current?.scrollToColumn({ index: -1 });
      }).toThrowError("Invalid index specified: -1");

      expect(() => {
        gridRef.current?.scrollToColumn({ index: 25 });
      }).toThrowError("Invalid index specified: 25");

      expect(() => {
        gridRef.current?.scrollToCell({ columnIndex: -1, rowIndex: 0 });
      }).toThrowError("Invalid index specified: -1");

      expect(() => {
        gridRef.current?.scrollToCell({ columnIndex: 25, rowIndex: 0 });
      }).toThrowError("Invalid index specified: 25");

      expect(() => {
        gridRef.current?.scrollToCell({ columnIndex: 0, rowIndex: -1 });
      }).toThrowError("Invalid index specified: -1");

      expect(() => {
        gridRef.current?.scrollToCell({ columnIndex: 0, rowIndex: 25 });
      }).toThrowError("Invalid index specified: 25");

      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();
    });
  });

  test("should auto-memoize cellProps object using shallow equality", () => {
    const { rerender } = render(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          foo: "abc",
          abc: 123
        }}
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
      />
    );

    expect(mountedCells).toHaveLength(8);
    expect(mountedCells.get("0,0")).toMatchObject({
      foo: "abc",
      abc: 123
    });

    expect(CellComponent).toHaveBeenCalledTimes(8);

    rerender(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          foo: "abc",
          abc: 123
        }}
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
      />
    );
    expect(CellComponent).toHaveBeenCalledTimes(8);

    rerender(
      <Grid
        cellComponent={CellComponent}
        cellProps={{
          foo: "abc",
          abc: 234
        }}
        columnCount={100}
        columnWidth={25}
        overscanCount={0}
        rowCount={100}
        rowHeight={20}
      />
    );
    expect(CellComponent).toHaveBeenCalledTimes(16);
  });

  describe("edge cases", () => {
    test("should not cause a cycle of Grid callback ref is passed in cellProps", () => {
      function CellComponentWithCellProps({
        columnIndex,
        rowIndex,
        style
      }: CellComponentProps<{ gridRef: GridImperativeAPI | null }>) {
        return (
          <div style={style}>
            {rowIndex},{columnIndex}
          </div>
        );
      }

      function Test() {
        const [gridRef, setGridRef] = useGridCallbackRef(null);

        return (
          <Grid
            cellComponent={CellComponentWithCellProps}
            cellProps={{ gridRef }}
            columnCount={100}
            columnWidth={25}
            gridRef={setGridRef}
            overscanCount={2}
            rowCount={100}
            rowHeight={20}
          />
        );
      }

      render(<Test />);
    });

    test("should not require ResizeObserver if size is provided", () => {
      simulateUnsupportedEnvironmentForTest();

      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={25}
          overscanCount={2}
          rowCount={100}
          rowHeight={20}
          style={{ height: 42, width: 84 }}
        />
      );
    });
  });

  describe("aria attributes", () => {
    test("should adhere to the best recommended practices", () => {
      render(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={2}
          columnWidth={25}
          overscanCount={0}
          rowCount={2}
          rowHeight={20}
        />
      );

      expect(screen.queryAllByRole("grid")).toHaveLength(1);

      const rows = screen.queryAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(rows[0].getAttribute("aria-rowindex")).toBe("1");
      expect(rows[1].getAttribute("aria-rowindex")).toBe("2");

      expect(screen.queryAllByRole("gridcell")).toHaveLength(4);

      {
        const cells = rows[0].querySelectorAll('[role="gridcell"]');
        expect(cells).toHaveLength(2);
        expect(cells[0].getAttribute("aria-colindex")).toBe("1");
        expect(cells[1].getAttribute("aria-colindex")).toBe("2");
      }

      {
        const cells = rows[1].querySelectorAll('[role="gridcell"]');
        expect(cells).toHaveLength(2);
        expect(cells[0].getAttribute("aria-colindex")).toBe("1");
        expect(cells[1].getAttribute("aria-colindex")).toBe("2");
      }
    });
  });
});
