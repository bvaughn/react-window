import { act, render, screen } from "@testing-library/react";
import { createRef, useLayoutEffect } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../../../src/constants";
import {
  disableForCurrentTest,
  updateMockResizeObserver
} from "../../utils/test/mockResizeObserver";
import { List } from "./List";
import { type ListImperativeAPI, type RowComponentProps } from "./types";
import { useListCallbackRef } from "./useListCallbackRef";

describe("List", () => {
  let mountedRows: Map<number, RowComponentProps<object>> = new Map();

  const RowComponent = vi.fn(function Row(props: RowComponentProps<object>) {
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
  });

  beforeEach(() => {
    RowComponent.mockReset();

    updateMockResizeObserver(new DOMRect(0, 0, 50, 100));

    mountedRows = new Map();
  });

  test("should render an empty list", () => {
    render(
      <List
        rowCount={0}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });

  test("should render enough rows to fill the available height", () => {
    const onResize = vi.fn();

    render(
      <List
        onResize={onResize}
        overscanCount={0}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    let items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[3]).toHaveTextContent("Row 3");

    expect(onResize).toBeCalledTimes(1);
    expect(onResize).toHaveBeenLastCalledWith(
      {
        height: 100,
        width: 50
      },
      {
        height: 0,
        width: 0
      }
    );

    act(() => {
      updateMockResizeObserver(new DOMRect(0, 0, 50, 75));
    });

    items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[2]).toHaveTextContent("Row 2");

    expect(onResize).toBeCalledTimes(2);
    expect(onResize).toHaveBeenLastCalledWith(
      {
        height: 75,
        width: 50
      },
      {
        height: 100,
        width: 50
      }
    );
  });

  test("should render enough rows to fill the available height with overscan", () => {
    render(
      <List
        overscanCount={2}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
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
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          bar: 123
        }}
      />
    );

    expect(mountedRows.size).toEqual(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
      bar: 123
    });
  });

  test("should re-render items if rowComponent changes", () => {
    const { rerender } = render(
      <List
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    const NewRow = vi.fn(() => null);

    rerender(
      <List
        rowCount={100}
        rowComponent={NewRow}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    expect(NewRow).toHaveBeenCalled();
  });

  test("should re-render items if rowHeight changes", () => {
    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );
    expect(mountedRows).toHaveLength(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={50}
        rowProps={EMPTY_OBJECT}
      />
    );
    expect(mountedRows).toHaveLength(3);
    expect(mountedRows.get(1)?.index).toEqual(1);
  });

  test("should re-render items if rowProps change", () => {
    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          foo: "abc"
        }}
      />
    );
    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc"
    });

    rerender(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          bar: 123
        }}
      />
    );
    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(1)?.index).toEqual(1);
    expect(mountedRows.get(0)).toMatchObject({
      bar: 123
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
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
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
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );
    expect(onRowsRendered).toHaveBeenCalledTimes(1);
    expect(onRowsRendered).toHaveBeenLastCalledWith({
      startIndex: 0,
      stopIndex: 1
    });

    rerender(
      <List
        overscanCount={0}
        rowCount={4}
        onRowsRendered={onRowsRendered}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );
    expect(onRowsRendered).toHaveBeenCalledTimes(2);
    expect(onRowsRendered).toHaveBeenLastCalledWith({
      startIndex: 0,
      stopIndex: 3
    });
  });

  test("should support custom className and style props", () => {
    render(
      <List
        overscanCount={0}
        className="foo"
        role="list"
        rowCount={4}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
        style={{
          backgroundColor: "red"
        }}
      />
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
        role="list"
        rowCount={4}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={EMPTY_OBJECT}
      />
    );

    expect(screen.queryByTestId("foo")).toHaveRole("list");
  });

  describe("imperative API", () => {
    test("should return the root element", () => {
      const listRef = createRef<ListImperativeAPI>();

      render(
        <List
          listRef={listRef}
          role="list"
          rowComponent={RowComponent}
          rowCount={4}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(listRef.current?.element).toEqual(screen.queryByRole("list"));
    });

    test("should scroll to rows", () => {
      const listRef = createRef<ListImperativeAPI>();

      render(
        <List
          rowCount={25}
          listRef={listRef}
          rowComponent={RowComponent}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );
      expect(HTMLElement.prototype.scrollTo).not.toHaveBeenCalled();

      listRef.current?.scrollToRow({ index: 8 });

      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1);
      expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({
        behavior: "auto",
        top: 125
      });
    });
  });

  test("should auto-memoize rowProps object using shallow equality", () => {
    const { rerender } = render(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 123
        }}
      />
    );

    expect(mountedRows).toHaveLength(5);
    expect(mountedRows.get(0)).toMatchObject({
      foo: "abc",
      abc: 123
    });

    expect(RowComponent).toHaveBeenCalledTimes(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 123
        }}
      />
    );
    expect(RowComponent).toHaveBeenCalledTimes(5);

    rerender(
      <List
        overscanCount={1}
        rowCount={100}
        rowComponent={RowComponent}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          abc: 234
        }}
      />
    );
    expect(RowComponent).toHaveBeenCalledTimes(10);
  });

  describe("rowHeight", () => {
    test("type: number (px)", () => {
      const { container } = render(
        <List
          overscanCount={0}
          rowCount={50}
          rowComponent={RowComponent}
          rowHeight={50}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(2);
    });

    test("type: function (px)", () => {
      const rowHeight = (index: number) => 25 + index * 25;

      const { container } = render(
        <List
          overscanCount={0}
          rowCount={50}
          rowComponent={RowComponent}
          rowHeight={rowHeight}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(3);
    });

    test("type: string (%)", () => {
      const { container } = render(
        <List
          overscanCount={0}
          rowCount={50}
          rowComponent={RowComponent}
          rowHeight="25%"
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(4);
    });
  });

  describe("edge cases", () => {
    test("should restore scroll indices if rowProps changes", () => {
      const listRef = createRef<ListImperativeAPI>();
      const onRowsRendered = vi.fn();

      const { rerender } = render(
        <List
          listRef={listRef}
          onRowsRendered={onRowsRendered}
          overscanCount={0}
          rowCount={100}
          rowComponent={RowComponent}
          rowHeight={25}
          rowProps={{
            foo: 1
          }}
        />
      );

      expect(onRowsRendered).toHaveBeenCalled();
      expect(onRowsRendered).toHaveBeenLastCalledWith({
        startIndex: 0,
        stopIndex: 3
      });

      onRowsRendered.mockReset();

      act(() => {
        listRef.current?.scrollToRow({ index: 10 });
      });
      expect(onRowsRendered).toHaveBeenCalledTimes(1);
      expect(onRowsRendered).toHaveBeenLastCalledWith({
        startIndex: 7,
        stopIndex: 10
      });

      expect(RowComponent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          foo: 1
        }),
        undefined
      );

      onRowsRendered.mockReset();
      RowComponent.mockReset();

      rerender(
        <List
          listRef={listRef}
          onRowsRendered={onRowsRendered}
          overscanCount={0}
          rowCount={100}
          rowComponent={RowComponent}
          rowHeight={25}
          rowProps={{
            foo: 2
          }}
        />
      );

      // Visible range of rows should not have changes
      expect(onRowsRendered).not.toHaveBeenCalled();

      // But rows should have been re-rendered
      expect(RowComponent).toHaveBeenCalledTimes(4);
      expect(RowComponent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          foo: 2
        }),
        undefined
      );
    });

    test("should handle temporarily invalid indices if rowCount decreases", () => {
      function CustomRowComponent({
        index,
        items,
        style
      }: RowComponentProps<{ items: string[] }>) {
        return <div style={style}>{items[index].toUpperCase()}</div>;
      }

      const { container, rerender } = render(
        <List
          overscanCount={0}
          rowCount={5}
          rowComponent={CustomRowComponent}
          rowHeight={25}
          rowProps={{
            items: ["a", "b", "c", "d", "e"]
          }}
        />
      );
      expect(container.textContent).toEqual("ABCD");

      rerender(
        <List
          overscanCount={0}
          rowCount={2}
          rowComponent={CustomRowComponent}
          rowHeight={25}
          rowProps={{
            items: ["a", "b"]
          }}
        />
      );
      expect(container.textContent).toEqual("AB");
    });

    test("should not cause a cycle of List callback ref is passed in rowProps", () => {
      function RowComponentWithRowProps({
        index,
        style
      }: RowComponentProps<{ listRef: ListImperativeAPI | null }>) {
        return <div style={style}>{index}</div>;
      }

      function Test() {
        const [listRef, setListRef] = useListCallbackRef(null);

        return (
          <List
            listRef={setListRef}
            rowComponent={RowComponentWithRowProps}
            rowCount={10}
            rowHeight={25}
            rowProps={{ listRef }}
          />
        );
      }

      render(<Test />);
    });
  });
});
