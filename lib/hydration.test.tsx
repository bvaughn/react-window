import { act } from "@testing-library/react";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { EMPTY_OBJECT } from "../src/constants";
import { Grid } from "./components/grid/Grid";
import type { CellComponentProps } from "./components/grid/types";
import { List } from "./components/list/List";
import { DATA_ATTRIBUTE_LIST_INDEX } from "./core/itemIndex";
import type { RowComponentProps } from "./components/list/types";
import { useDynamicRowHeight } from "./components/list/useDynamicRowHeight";
import {
  setDefaultElementSize,
  setElementSizeFunction
} from "./utils/test/mockResizeObserver";

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

function DynamicList({
  children,
  initialRowHeights
}: {
  children?: ReactNode;
  initialRowHeights?: number[];
}) {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 25,
    initialRowHeights
  });

  return (
    <List
      defaultHeight={100}
      overscanCount={0}
      rowComponent={RowComponent}
      rowCount={100}
      rowHeight={rowHeight}
      rowProps={EMPTY_OBJECT}
    >
      {children}
    </List>
  );
}

// Resolves after requestAnimationFrame callbacks scheduled before this call,
// including callbacks they schedule (nested up to `count - 1` levels deep)
async function waitForAnimationFrames(count = 2) {
  await act(async () => {
    for (let i = 0; i < count; i++) {
      await new Promise(requestAnimationFrame);
    }
  });
}

describe("hydration", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  let recoverableErrors: unknown[];
  let roots: Root[];

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    recoverableErrors = [];
    roots = [];

    setDefaultElementSize({ height: 100, width: 200 });
  });

  afterEach(() => {
    act(() => {
      roots.forEach((root) => root.unmount());
    });

    document.body.innerHTML = "";

    expect(recoverableErrors).toEqual([]);
    expect(
      consoleError.mock.calls.filter(
        // React 18 warns about useLayoutEffect when server rendering in an environment with a global window object;
        // this only happens because these tests server render within jsdom (see ssr.test.tsx for real server rendering)
        ([message]) =>
          !String(message).includes(
            "useLayoutEffect does nothing on the server"
          )
      )
    ).toEqual([]);

    consoleError.mockRestore();
  });

  function serverRenderAndHydrate(
    element: ReactElement,
    {
      beforeHydrate,
      wrapperDir
    }: {
      beforeHydrate?: (container: HTMLElement) => void;
      wrapperDir?: "rtl";
    } = {}
  ) {
    const container = document.createElement("div");
    if (wrapperDir) {
      container.setAttribute("dir", wrapperDir);
    }
    container.innerHTML = renderToString(element);
    document.body.appendChild(container);

    const serverHTML = container.innerHTML;

    beforeHydrate?.(container);

    act(() => {
      roots.push(
        hydrateRoot(container, element, {
          onRecoverableError: (error) => recoverableErrors.push(error)
        })
      );
    });

    return { container, serverHTML };
  }

  describe("List", () => {
    test("should update rows when the measured height differs from defaultHeight", () => {
      const { container, serverHTML } = serverRenderAndHydrate(
        <List
          defaultHeight={50}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(serverHTML.match(/role="listitem"/g)).toHaveLength(2);
      expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(4);
    });

    test("should remove extra server-rendered rows if defaultHeight is larger than the measured height", () => {
      const { container, serverHTML } = serverRenderAndHydrate(
        <List
          defaultHeight={400}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />
      );

      expect(serverHTML.match(/role="listitem"/g)).toHaveLength(16);
      expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(4);
    });

    test("should switch dynamic height rows from flow to absolute layout once measured", () => {
      setElementSizeFunction((element) => {
        if (element.hasAttribute(DATA_ATTRIBUTE_LIST_INDEX)) {
          return new DOMRect(0, 0, 200, 40);
        }
      });

      const { container, serverHTML } = serverRenderAndHydrate(<DynamicList />);

      expect(serverHTML).not.toContain("translateY");

      const rows = container.querySelectorAll<HTMLElement>('[role="listitem"]');
      expect(rows).toHaveLength(3);
      expect(rows[0].style.position).toBe("absolute");
      expect(rows[1].style.transform).toBe("translateY(40px)");
      expect(rows[2].style.transform).toBe("translateY(80px)");
    });

    test("should render children before dynamic height rows until they switch to absolute layout", () => {
      setElementSizeFunction((element) => {
        if (element.hasAttribute(DATA_ATTRIBUTE_LIST_INDEX)) {
          return new DOMRect(0, 0, 200, 40);
        }
      });

      const onMount = vi.fn();

      function StickyRow() {
        useEffect(onMount, []);

        return <div data-testid="sticky-row" />;
      }

      const { container, serverHTML } = serverRenderAndHydrate(
        <DynamicList>
          <StickyRow />
        </DynamicList>
      );

      // Rows in flow layout would otherwise push sticky children below them
      const stickyRowIndex = serverHTML.indexOf("sticky-row");
      const firstRowIndex = serverHTML.indexOf('role="listitem"');
      expect(stickyRowIndex).toBeGreaterThan(-1);
      expect(firstRowIndex).toBeGreaterThan(-1);
      expect(stickyRowIndex).toBeLessThan(firstRowIndex);

      const list = container.querySelector('[role="list"]')!;
      const stickyRow = container.querySelector('[data-testid="sticky-row"]');
      const rows = container.querySelectorAll<HTMLElement>('[role="listitem"]');
      expect(rows[0].style.position).toBe("absolute");
      expect(Array.from(list.children).indexOf(stickyRow!)).toBe(rows.length);

      // Children should be moved (rather than remounted) when rows switch to absolute layout
      expect(onMount).toHaveBeenCalledTimes(1);
    });

    test("should switch dynamic height rows to absolute layout if measurements never arrive", async () => {
      // Simulate rows that have no height yet (e.g. images that haven't loaded); these measurements are ignored
      setElementSizeFunction((element) => {
        if (element.hasAttribute(DATA_ATTRIBUTE_LIST_INDEX)) {
          return new DOMRect(0, 0, 0, 0);
        }
      });

      const { container } = serverRenderAndHydrate(<DynamicList />);

      const getFirstRow = () =>
        container.querySelector<HTMLElement>('[role="listitem"]')!;

      expect(getFirstRow().style.position).toBe("");

      await waitForAnimationFrames();

      expect(getFirstRow().style.position).toBe("absolute");
    });

    test("should switch dynamic height rows to absolute layout if measurements match initialRowHeights", async () => {
      // Measurements that match the initial heights don't change the dynamic row height cache
      setElementSizeFunction((element) => {
        if (element.hasAttribute(DATA_ATTRIBUTE_LIST_INDEX)) {
          return new DOMRect(0, 0, 200, 50);
        }
      });

      const { container } = serverRenderAndHydrate(
        <DynamicList initialRowHeights={[50, 50, 50]} />
      );

      const getRows = () =>
        container.querySelectorAll<HTMLElement>('[role="listitem"]');

      expect(getRows()[0].style.position).toBe("");

      await waitForAnimationFrames();

      const rows = getRows();
      expect(rows).toHaveLength(2);
      expect(rows[0].style.position).toBe("absolute");
      expect(rows[1].style.transform).toBe("translateY(50px)");
    });

    test("should use initialRowHeights to position dynamic height rows", () => {
      // Disable measurements so that only initial heights are used
      setElementSizeFunction((element) => {
        if (element.hasAttribute(DATA_ATTRIBUTE_LIST_INDEX)) {
          return new DOMRect(0, 0, 0, 0);
        }
      });

      const { serverHTML } = serverRenderAndHydrate(
        <DynamicList initialRowHeights={[50, 50, 50]} />
      );

      expect(serverHTML.match(/role="listitem"/g)).toHaveLength(2);
    });

    test("should apply defaultScrollOffset after hydrating", () => {
      const { container, serverHTML } = serverRenderAndHydrate(
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

      // React separates adjacent text nodes with comments (e.g. "Row <!-- -->0"), which is an implementation detail
      expect(serverHTML.replace(/<!--.*?-->/g, "")).toContain("Row 0<");

      const list = container.querySelector('[role="list"]') as HTMLElement;
      expect(list.scrollTop).toBe(500);

      const rows = container.querySelectorAll('[role="listitem"]');
      expect(rows).toHaveLength(4);
      expect(rows[0].textContent).toBe("Row 20");
    });

    test("should not override a scroll offset restored before hydrating", () => {
      const { container } = serverRenderAndHydrate(
        <List
          defaultHeight={100}
          defaultScrollOffset={500}
          overscanCount={0}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={25}
          rowProps={EMPTY_OBJECT}
        />,
        {
          beforeHydrate: (container) => {
            // Simulate browser scroll restoration (or the user scrolling before hydration)
            container.querySelector('[role="list"]')!.scrollTop = 250;
          }
        }
      );

      const list = container.querySelector('[role="list"]') as HTMLElement;
      expect(list.scrollTop).toBe(250);

      const rows = container.querySelectorAll('[role="listitem"]');
      expect(rows[0].textContent).toBe("Row 10");
    });
  });

  describe("Grid", () => {
    test("should update cells when the measured size differs from defaultHeight and defaultWidth", () => {
      const { container, serverHTML } = serverRenderAndHydrate(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={50}
          defaultWidth={100}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
        />
      );

      expect(serverHTML.match(/role="gridcell"/g)).toHaveLength(4);
      expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(16);
    });

    test("should apply defaultScrollLeft and defaultScrollTop after hydrating", () => {
      const { container } = serverRenderAndHydrate(
        <Grid
          cellComponent={CellComponent}
          cellProps={EMPTY_OBJECT}
          columnCount={100}
          columnWidth={50}
          defaultHeight={100}
          defaultScrollLeft={500}
          defaultScrollTop={250}
          defaultWidth={200}
          overscanCount={0}
          rowCount={100}
          rowHeight={25}
        />
      );

      const grid = container.querySelector('[role="grid"]') as HTMLElement;
      expect(grid.scrollLeft).toBe(500);
      expect(grid.scrollTop).toBe(250);

      const cells = container.querySelectorAll('[role="gridcell"]');
      expect(cells[0].textContent).toBe("Cell 10,10");
    });

    test("should switch to right-to-left layout for direction inherited from an ancestor", () => {
      const { container, serverHTML } = serverRenderAndHydrate(
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
        />,
        { wrapperDir: "rtl" }
      );

      expect(serverHTML).not.toContain("right:0");

      const cell = container.querySelector<HTMLElement>('[role="gridcell"]')!;
      expect(cell.style.right).toBe("0px");
    });
  });
});
