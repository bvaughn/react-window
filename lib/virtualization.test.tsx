import { act, render, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { Grid } from "./components/grid/Grid";
import type {
  CellComponentProps,
  GridImperativeAPI
} from "./components/grid/types";
import { List } from "./components/list/List";
import type {
  DynamicRowHeight,
  RowComponentProps
} from "./components/list/types";
import { useDynamicRowHeight } from "./components/list/useDynamicRowHeight";
import { useVirtualizer } from "./core/useVirtualizer";
import { getRTLOffsetType } from "./utils/getRTLOffsetType";
import { setElementSize } from "./utils/test/mockResizeObserver";

vi.mock("./utils/getRTLOffsetType", () => ({ getRTLOffsetType: vi.fn() }));

beforeEach(() => {
  vi.mocked(getRTLOffsetType).mockReturnValue("negative");
});

test("RTL auto alignment preserves an already visible column", () => {
  const gridRef = createRef<GridImperativeAPI>();
  function Cell({ style }: CellComponentProps) {
    return <div style={style} />;
  }
  render(
    <Grid
      cellComponent={Cell}
      cellProps={{}}
      columnCount={100}
      columnWidth={50}
      rowCount={1}
      rowHeight={50}
      dir="rtl"
      gridRef={gridRef}
      style={{ width: 200, height: 100 }}
    />
  );
  act(() => {
    gridRef.current!.element!.scrollTo({ left: -200 });
  });
  act(() => {
    gridRef.current!.scrollToColumn({ index: 5 });
  });
  expect(gridRef.current!.element!.scrollLeft).toBe(-200);
});

test("switching RTL updates the scroll listener", () => {
  const containerElement = document.createElement("div");
  const itemProps = {};
  const { result, rerender } = renderHook(
    (isRtl: boolean) =>
      useVirtualizer({
        containerElement,
        containerStyle: { width: 200, height: 100 },
        direction: "horizontal",
        isRtl,
        itemCount: 100,
        itemProps,
        itemSize: 50,
        overscanCount: 0,
        onResize: undefined
      }),
    { initialProps: false }
  );
  rerender(true);
  act(() => {
    containerElement.scrollTo({ left: -200 });
  });
  expect(result.current.startIndexVisible).toBe(4);
});

test("inherited RTL uses RTL coordinates when scrolling", () => {
  const gridRef = createRef<GridImperativeAPI>();
  function Cell({ columnIndex, style }: CellComponentProps) {
    return <div data-column={columnIndex} style={style} />;
  }
  const { container } = render(
    <div dir="rtl">
      <Grid
        cellComponent={Cell}
        cellProps={{}}
        columnCount={100}
        columnWidth={50}
        rowCount={1}
        rowHeight={50}
        gridRef={gridRef}
        overscanCount={0}
        style={{ width: 200, height: 100 }}
      />
    </div>
  );
  act(() => {
    gridRef.current!.element!.scrollTo({ left: -200 });
  });
  expect(
    container.querySelector("[data-column]")!.getAttribute("data-column")
  ).toBe("4");
});

test("custom row key reordering updates measurement indices", () => {
  const rowHeight = {
    getRowHeight: () => 50,
    getAverageRowHeight: () => 50,
    setRowHeight: vi.fn(),
    observeRowElements: () => () => {}
  };
  const rowKey = (index: number, { data }: { data: string[] }) => data[index];
  function Row({ index, data, style }: RowComponentProps<{ data: string[] }>) {
    return <div style={style}>{data[index]}</div>;
  }
  const { container, rerender } = render(
    <List
      rowComponent={Row}
      rowProps={{ data: ["a", "b"] }}
      rowCount={2}
      rowHeight={rowHeight}
      rowKey={rowKey}
      style={{ height: 100 }}
    />
  );
  rerender(
    <List
      rowComponent={Row}
      rowProps={{ data: ["b", "a"] }}
      rowCount={2}
      rowHeight={rowHeight}
      rowKey={rowKey}
      style={{ height: 100 }}
    />
  );
  expect(container.firstElementChild!.firstElementChild!.textContent).toBe("b");
  expect(
    container.firstElementChild!.firstElementChild!.getAttribute(
      "data-react-window-index"
    )
  ).toBe("0");
});

test.each(["negative", "positive-ascending", "positive-descending"] as const)(
  "normalizes both directions of imperative RTL scrolling (%s)",
  (offsetType) => {
    vi.mocked(getRTLOffsetType).mockReturnValue(offsetType);
    const gridRef = createRef<GridImperativeAPI>();
    function Cell({ style }: CellComponentProps) {
      return <div style={style} />;
    }
    render(
      <Grid
        cellComponent={Cell}
        cellProps={{}}
        columnCount={100}
        columnWidth={50}
        rowCount={1}
        rowHeight={50}
        dir="rtl"
        gridRef={gridRef}
        style={{ width: 200, height: 100 }}
      />
    );
    const element = gridRef.current!.element!;
    Object.defineProperties(element, {
      scrollWidth: { value: 5000 },
      clientWidth: { value: 200 }
    });
    const toNative = (offset: number) =>
      offsetType === "negative"
        ? -offset
        : offsetType === "positive-descending"
          ? 4800 - offset
          : offset;
    act(() => {
      element.scrollTo({ left: toNative(200) });
    });
    act(() => {
      gridRef.current!.scrollToColumn({ index: 5 });
    });
    expect(element.scrollLeft).toBe(toNative(200));
    act(() => {
      gridRef.current!.scrollToColumn({ index: 10, align: "start" });
    });
    expect(element.scrollLeft).toBe(toNative(500));
    act(() => {
      gridRef.current!.scrollToCell({
        columnIndex: 5,
        columnAlign: "smart",
        rowIndex: 0
      });
    });
    expect(element.scrollLeft).toBe(toNative(175));
  }
);

test("updates the correct height cache entry after keyed rows reorder", () => {
  let rowHeight: DynamicRowHeight;
  const rowKey = (index: number, { data }: { data: string[] }) => data[index];
  function Row({ index, data, style }: RowComponentProps<{ data: string[] }>) {
    return <div style={style}>{data[index]}</div>;
  }
  function Example({ data }: { data: string[] }) {
    rowHeight = useDynamicRowHeight({ defaultRowHeight: 50 });
    return (
      <List
        rowComponent={Row}
        rowProps={{ data }}
        rowCount={2}
        rowHeight={rowHeight}
        rowKey={rowKey}
        style={{ height: 100 }}
      />
    );
  }
  const { container, rerender } = render(<Example data={["a", "b"]} />);
  rerender(<Example data={["b", "a"]} />);
  const firstRow = container.firstElementChild!
    .firstElementChild! as HTMLElement;
  act(() => {
    setElementSize({ element: firstRow, height: 80, width: 100 });
  });
  expect(rowHeight!.getRowHeight(0)).toBe(80);
  expect(rowHeight!.getRowHeight(1)).toBe(50);
});
