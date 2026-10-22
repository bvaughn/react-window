// @vitest-environment node

import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../src/constants";
import { Grid } from "./components/grid/Grid";
import type { CellComponentProps } from "./components/grid/types";
import { List } from "./components/list/List";
import type { RowComponentProps } from "./components/list/types";
import { useDynamicRowHeight } from "./components/list/useDynamicRowHeight";
import { getScrollbarSize } from "./utils/getScrollbarSize";

function RowComponent({ ariaAttributes, index, style }: RowComponentProps) {
  return (
    <div {...ariaAttributes} style={style}>
      Row {index}
    </div>
  );
}

function CellComponent({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps) {
  return (
    <div {...ariaAttributes} style={style}>
      Cell {rowIndex},{columnIndex}
    </div>
  );
}

// React separates adjacent text nodes with comments (e.g. "Row <!-- -->0"), which is an implementation detail
function stripComments(html: string) {
  return html.replace(/<!--.*?-->/g, "");
}

function countRows(html: string) {
  return html.match(/role="listitem"/g)?.length ?? 0;
}

function countCells(html: string) {
  return html.match(/role="gridcell"/g)?.length ?? 0;
}

describe("server rendering", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  let consoleWarn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  });

  describe("List", () => {
    test("should render rows to fill the defaultHeight", () => {
      const html = renderToString(
        <List
          defaultHeight={100}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(countRows(html)).toBe(4);
      expect(consoleError).not.toHaveBeenCalled();
      expect(consoleWarn).not.toHaveBeenCalled();
    });

    test("should render rows to fill the defaultHeight when scrolling with the window", () => {
      const html = renderToString(
        <List
          defaultHeight={100}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
          scrollElement="window"
        />
      );

      expect(countRows(html)).toBe(4);
      expect(html).not.toContain("overflow-y");
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should render rows to fill a pixel height specified by style", () => {
      const html = renderToString(
        <List
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
          style={{ height: 100 }}
        />
      );

      expect(countRows(html)).toBe(4);
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should support rowHeight functions", () => {
      const html = renderToString(
        <List
          defaultHeight={100}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={(index) => (index % 2 === 0 ? 20 : 30)}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(countRows(html)).toBe(4);
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should support percentage row heights if a defaultHeight is provided", () => {
      const html = renderToString(
        <List
          defaultHeight={100}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight="25%"
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(countRows(html)).toBe(4);
      expect(html).toContain("height:25px");
      expect(consoleError).not.toHaveBeenCalled();
      expect(consoleWarn).not.toHaveBeenCalled();
    });

    test("should ignore defaultScrollOffset", () => {
      const html = renderToString(
        <List
          defaultHeight={100}
          defaultScrollOffset={500}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(countRows(html)).toBe(4);
      expect(stripComments(html)).toContain("Row 0<");
      expect(stripComments(html)).not.toContain("Row 20<");
    });

    test("should render dynamic height rows in normal document flow", () => {
      function DynamicList() {
        const rowHeight = useDynamicRowHeight({ defaultRowHeight: 25 });

        return (
          <List
            defaultHeight={100}
            overscanCount={0}
            rowComponent={RowComponent}
            rowCount={100}
            rowHeight={rowHeight}
            rowProps={EMPTY_OBJECT}
          />
        );
      }

      const html = renderToString(<DynamicList />);

      expect(countRows(html)).toBe(4);
      expect(html).not.toContain("translateY");
      expect(html).toContain(
        'data-react-window-sizer="" style="position:absolute;top:0'
      );
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should use initialRowHeights for dynamic height rows", () => {
      function DynamicList() {
        const rowHeight = useDynamicRowHeight({
          defaultRowHeight: 25,
          initialRowHeights: [50, 50]
        });

        return (
          <List
            defaultHeight={100}
            overscanCount={0}
            rowComponent={RowComponent}
            rowCount={100}
            rowHeight={rowHeight}
            rowProps={EMPTY_OBJECT}
          />
        );
      }

      const html = renderToString(<DynamicList />);

      expect(countRows(html)).toBe(2);
    });
  });

  describe("Grid", () => {
    test("should render cells to fill the defaultHeight and defaultWidth", () => {
      const html = renderToString(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={100}
          defaultWidth={200}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
        />
      );

      expect(countCells(html)).toBe(16);
      expect(consoleError).not.toHaveBeenCalled();
      expect(consoleWarn).not.toHaveBeenCalled();
    });

    test("should render cells to fill the defaultHeight and defaultWidth when scrolling with the window", () => {
      const html = renderToString(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={100}
          defaultWidth={200}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
          scrollElement="window"
        />
      );

      expect(countCells(html)).toBe(16);
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should render cells to fill a pixel size specified by style", () => {
      const html = renderToString(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
          style={{ height: 100, width: 200 }}
        />
      );

      expect(countCells(html)).toBe(16);
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should support right-to-left grids", () => {
      const html = renderToString(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={100}
          defaultWidth={200}
          dir="rtl"
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
        />
      );

      expect(countCells(html)).toBe(16);
      expect(html).toContain("right:0");
      expect(consoleError).not.toHaveBeenCalled();
    });

    test("should ignore defaultScrollLeft and defaultScrollTop", () => {
      const html = renderToString(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={100}
          defaultScrollLeft={500}
          defaultScrollTop={500}
          defaultWidth={200}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
        />
      );

      expect(countCells(html)).toBe(16);
      expect(stripComments(html)).toContain("Cell 0,0<");
    });
  });

  test("getScrollbarSize should not throw", () => {
    expect(getScrollbarSize()).toBe(0);
  });
});
