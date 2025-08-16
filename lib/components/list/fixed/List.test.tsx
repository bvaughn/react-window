import { act, render, screen } from "@testing-library/react";
import { createRef, useLayoutEffect, type CSSProperties } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  disableForCurrentTest,
  updateMockResizeObserver,
} from "../../../utils/test/mockResizeObserver";
import { type ListImperativeAPI, type RowComponentProps } from "../types";
import { List } from "./List";

describe("List", () => {
  function Row(props: { index: number; style: CSSProperties }) {
    const { index, style } = props;

    useLayoutEffect(() => {
      mountedRows.set(index, props);
      return () => {
        mountedRows.delete(index);
      };
    });

    return (
      <div role="listitem" style={style}>
        Row {index}
      </div>
    );
  }

  let mountedRows: Map<number, RowComponentProps<object>> = new Map();

  beforeEach(() => {
    updateMockResizeObserver(new DOMRect(0, 0, 50, 100));

    mountedRows = new Map();
  });

  test("should render an empty list", () => {
    render(
      <List rowCount={0} rowComponent={Row} rowHeight={25} rowProps={{}} />,
    );

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });

  test("should render enough rows to fill the available height", () => {
    render(
      <List
        overscanCount={0}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{}}
      />,
    );

    let items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[3]).toHaveTextContent("Row 3");

    act(() => {
      updateMockResizeObserver(new DOMRect(0, 0, 50, 75));
    });

    items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[2]).toHaveTextContent("Row 2");
  });

  test("should render enough rows to fill the available height with overscan", () => {
    render(
      <List
        overscanCount={2}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{}}
      />,
    );

    let items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[5]).toHaveTextContent("Row 5");

    act(() => {
      updateMockResizeObserver(new DOMRect(0, 0, 50, 75));
    });

    items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[4]).toHaveTextContent("Row 4");
  });

  test("should pass rowProps to the rowComponent", () => {
    render(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          bar: 123,
        }}
      />,
    );

    expect(mountedRows.size).toEqual(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
      bar: 123,
    });
  });

  test("should re-render items if rowComponent changes", () => {
    const { rerender } = render(
      <List rowCount={10} rowComponent={Row} rowHeight={25} />,
    );

    const NewRow = vi.fn(() => null);

    rerender(<List rowCount={10} rowComponent={NewRow} rowHeight={25} />);

    expect(NewRow).toHaveBeenCalled();
  });

  test("should re-render items if rowHeight changes", () => {
    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
      />,
    );
    expect(mountedRows).toHaveLength(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={Row}
        rowHeight={50}
      />,
    );
    expect(mountedRows).toHaveLength(3);
    expect(mountedRows.get(1)?.index).toEqual(1);
  });

  test("should re-render items if rowProps change", () => {
    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          foo: "abc",
        }}
      />,
    );
    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
    });

    rerender(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          bar: 123,
        }}
      />,
    );
    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(1)?.index).toEqual(1);
    expect(mountedRows.get(0)).toMatchObject({
      bar: 123,
    });
  });

  test("should use defaultHeight for initial mount", () => {
    // Mimic server rendering
    disableForCurrentTest();

    render(
      <List
        overscanCount={0}
        defaultHeight={75}
        rowCount={4}
        rowComponent={Row}
        rowHeight={25}
      />,
    );

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  test("should call onRowsRendered", () => {
    const onRowsRendered = vi.fn();

    const { rerender } = render(
      <List
        overscanCount={0}
        defaultHeight={100}
        rowCount={2}
        onRowsRendered={onRowsRendered}
        rowComponent={Row}
        rowHeight={25}
      />,
    );
    expect(onRowsRendered).toHaveBeenCalledTimes(1);
    expect(onRowsRendered).toHaveBeenLastCalledWith({
      startIndex: 0,
      stopIndex: 1,
    });

    rerender(
      <List
        overscanCount={0}
        rowCount={4}
        onRowsRendered={onRowsRendered}
        rowComponent={Row}
        rowHeight={25}
      />,
    );
    expect(onRowsRendered).toHaveBeenCalledTimes(2);
    expect(onRowsRendered).toHaveBeenLastCalledWith({
      startIndex: 0,
      stopIndex: 3,
    });
  });

  test("should support custom className and style props", () => {
    render(
      <List
        overscanCount={0}
        className="foo"
        rowCount={4}
        rowComponent={Row}
        rowHeight={25}
        style={{
          backgroundColor: "red",
        }}
      />,
    );

    const list = screen.queryByRole("list");
    expect(list).toHaveClass("foo");
    expect(list?.style.backgroundColor).toBe("red");
  });

  test("should spread HTML rest attributes", () => {
    render(
      <List
        overscanCount={0}
        data-testid="foo"
        rowCount={4}
        rowComponent={Row}
        rowHeight={25}
      />,
    );

    expect(screen.queryByTestId("foo")).toHaveRole("list");
  });

  describe("imperative API", () => {
    test("should return the root element", () => {
      const listRef = createRef<ListImperativeAPI>();

      render(
        <List
          rowCount={4}
          listRef={listRef}
          rowComponent={Row}
          rowHeight={25}
        />,
      );

      expect(listRef.current?.element).toEqual(screen.queryByRole("list"));
    });

    test("should scroll to rows", () => {
      const listRef = createRef<ListImperativeAPI>();

      const scrollTo = vi.fn();

      Element.prototype.scrollTo = scrollTo;

      render(
        <List
          rowCount={4}
          listRef={listRef}
          rowComponent={Row}
          rowHeight={25}
        />,
      );
      expect(scrollTo).not.toHaveBeenCalled();

      listRef.current?.scrollToRow({ index: 8 });
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).not.toHaveBeenLastCalledWith(8, "auto");
    });
  });

  test("should auto-memoize rowProps object using shallow equality", () => {
    const RowSpy = vi.fn(Row);

    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={RowSpy}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 123,
        }}
      />,
    );

    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
      abc: 123,
    });

    expect(RowSpy).toHaveBeenCalledTimes(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={RowSpy}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 123,
        }}
      />,
    );
    expect(RowSpy).toHaveBeenCalledTimes(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={10}
        rowComponent={RowSpy}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 234,
        }}
      />,
    );
    expect(RowSpy).toHaveBeenCalledTimes(10);
  });
});
