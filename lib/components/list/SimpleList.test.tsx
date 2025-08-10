import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SimpleList } from "./SimpleList";
import { updateMockResizeObserver } from "../../utils/test/mockResizeObserver";
import type { CSSProperties } from "react";

describe("SimpleList", () => {
  beforeEach(() => {
    updateMockResizeObserver(new DOMRect(0, 0, 50, 100));
  });

  function Row({ index, style }: { index: number; style: CSSProperties }) {
    return (
      <div role="listitem" style={style}>
        Row {index}
      </div>
    );
  }

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
    const RowMock = vi.fn(({ foo, bar, ...rest }) => {
      expect(foo).toBe("abc");
      expect(bar).toBe(123);
      return <Row {...rest} />;
    });

    render(
      <SimpleList
        length={10}
        rowComponent={RowMock}
        rowHeight={25}
        rowProps={{
          foo: "abc",
          bar: 123,
        }}
      />,
    );

    expect(RowMock).toHaveBeenCalled();
  });
});
