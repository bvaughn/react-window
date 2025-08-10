import { act, render, screen } from "@testing-library/react";
import { createRef, useLayoutEffect, type CSSProperties } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  disableForCurrentTest,
  updateMockResizeObserver,
} from "../../utils/test/mockResizeObserver";
import { SimpleList } from "./SimpleList";
import { type SimpleListImperativeAPI, type RowProps } from "./types";

describe("SimpleList", () => {
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

  let mountedRows: Map<number, RowProps<unknown>> = new Map();

  beforeEach(() => {
    updateMockResizeObserver(new DOMRect(0, 0, 50, 100));

    mountedRows = new Map();
  });

  test("should render an empty list", () => {
    render(
      <SimpleList length={0} rowComponent={Row} rowHeight={25} rowProps={{}} />,
    );

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });

  test("should render enough rows to fill the available height", () => {
    render(
      <SimpleList
        length={10}
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

  test("should pass rowProps to the rowComponent", () => {
    render(
      <SimpleList
        length={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          bar: 123,
        }}
      />,
    );

    expect(mountedRows.size).toEqual(4);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
      bar: 123,
    });
  });

  test("should re-render items if rowComponent changes", () => {
    const { rerender } = render(
      <SimpleList length={10} rowComponent={Row} rowHeight={25} />,
    );

    const NewRow = vi.fn(() => null);

    rerender(<SimpleList length={10} rowComponent={NewRow} rowHeight={25} />);

    expect(NewRow).toHaveBeenCalled();
  });

  test("should re-render items if rowHeight changes", () => {
    const { rerender } = render(
      <SimpleList length={10} rowComponent={Row} rowHeight={25} />,
    );
    expect(mountedRows).toHaveLength(4);

    rerender(<SimpleList length={10} rowComponent={Row} rowHeight={50} />);
    expect(mountedRows).toHaveLength(2);
    expect(mountedRows.get(1)?.index).toEqual(1);
  });

  test("should re-render items if rowProps change", () => {
    const { rerender } = render(
      <SimpleList
        length={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          foo: "abc",
        }}
      />,
    );
    expect(mountedRows).toHaveLength(4);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
    });

    rerender(
      <SimpleList
        length={10}
        rowComponent={Row}
        rowHeight={25}
        rowProps={{
          bar: 123,
        }}
      />,
    );
    expect(mountedRows).toHaveLength(4);
    expect(mountedRows.get(1)?.index).toEqual(1);
    expect(mountedRows.get(0)).toMatchObject({
      bar: 123,
    });
  });

  test("should use defaultHeight for initial mount", () => {
    // Mimic server rendering
    disableForCurrentTest();

    render(
      <SimpleList
        defaultHeight={75}
        length={4}
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
      <SimpleList
        defaultHeight={100}
        length={2}
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
      <SimpleList
        length={4}
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
      <SimpleList
        className="foo"
        length={4}
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
      <SimpleList
        data-testid="foo"
        length={4}
        rowComponent={Row}
        rowHeight={25}
      />,
    );

    expect(screen.queryByTestId("foo")).toHaveRole("list");
  });

  describe("imperative API", () => {
    test("should return the root element", () => {
      const listRef = createRef<SimpleListImperativeAPI>();

      render(
        <SimpleList
          length={4}
          listRef={listRef}
          rowComponent={Row}
          rowHeight={25}
        />,
      );

      expect(listRef.current?.element).toEqual(screen.queryByRole("list"));
    });

    test("should scroll to rows", () => {
      const listRef = createRef<SimpleListImperativeAPI>();

      const scrollTo = vi.fn();

      Element.prototype.scrollTo = scrollTo;

      render(
        <SimpleList
          length={4}
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

    // Test More variations of "align"
    // This is probably better done by directly testing the method used to compute scroll offsets
  });
});
