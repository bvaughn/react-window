import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { SimpleList } from "./SimpleList";
import { updateMockResizeObserver } from "../../utils/test/mockResizeObserver";

describe("SimpleList", () => {
  beforeEach(() => {
    updateMockResizeObserver(new DOMRect(0, 0, 50, 100));
  });

  test("should render enough rows to fill the available height", () => {
    render(
      <SimpleList
        length={10}
        rowComponent={({ index }) => <div role="listitem">Row {index}</div>}
        rowHeight={25}
        rowProps={{}}
      />,
    );

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Row 0");
    expect(items[3]).toHaveTextContent("Row 3");
  });
});
