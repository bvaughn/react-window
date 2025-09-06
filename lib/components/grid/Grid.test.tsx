import { render, screen } from "@testing-library/react";
import { createRef, useLayoutEffect } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../../../src/constants";
import { updateMockResizeObserver } from "../../utils/test/mockResizeObserver";
import { Grid } from "./Grid";
import type { CellComponentProps, GridImperativeAPI } from "./types";

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

    updateMockResizeObserver(new DOMRect(0, 0, 100, 40));

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

  test.skip("should pass cellProps to the cellComponent", () => {
    // TODO
  });

  test.skip("should re-render items if cellComponent changes", () => {
    // TODO
  });

  test.skip("should re-render items if cell size changes", () => {
    // TODO
  });

  test.skip("should re-render items if cellProps change", () => {
    // TODO
  });

  test.skip("should use default sizes for initial mount", () => {
    // TODO
  });

  test.skip("should call onCellsRendered", () => {
    // TODO
  });

  test.skip("should support custom className and style props", () => {
    // TODO
  });

  test.skip("should spread HTML rest attributes", () => {
    // TODO
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
    test.skip("should return the root element", () => {
      // TODO
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
  });

  test.skip("should auto-memoize cellProps object using shallow equality", () => {
    // TODO
  });

  describe("edge cases", () => {
    test.skip("should not cause a cycle of Grid callback ref is passed in cellProps", () => {
      // TODO
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
