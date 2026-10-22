import { useLayoutEffect, useState } from "react";
import {
  Grid,
  List,
  useDynamicRowHeight,
  useGridRef,
  useIsScrolling,
  useListRef,
  type CellComponentProps,
  type RowComponentProps
} from "react-window";

type Align = "auto" | "center" | "end" | "smart" | "start";

function getParams() {
  const params = new URLSearchParams(location.search);
  return {
    align: (params.get("align") ?? "start") as Align,
    columnIndex: Number(params.get("column") ?? 30),
    dir: params.get("dir") === "rtl" ? ("rtl" as const) : undefined,
    dynamic: params.has("dynamic"),
    element: params.has("element"),
    full: params.has("full"),
    htmlFull: params.has("html-full"),
    index: Number(params.get("index") ?? 250),
    noAnchor: params.has("no-anchor"),
    sticky: params.has("sticky")
  };
}

// Content above the list, so the list doesn't start at the top of the page
function Spacer() {
  return (
    <div data-testid="spacer" style={{ height: 300, background: "#eee" }}>
      Content above
    </div>
  );
}

// Content above the list that changes size (or inserts content) without re-rendering the list;
// tests trigger changes by dispatching an "above" event, e.g. { detail: { height: 600 } }
function ChangingContentAbove() {
  const [state, setState] = useState({ height: 300, insert: false });

  useLayoutEffect(() => {
    const onChange = (event: Event) => {
      const { detail } = event as CustomEvent<Partial<typeof state>>;
      setState((prev) => ({ ...prev, ...detail }));
    };
    window.addEventListener("above", onChange);
    return () => window.removeEventListener("above", onChange);
  }, []);

  return (
    <>
      {state.insert && (
        <div data-testid="inserted" style={{ height: 400 }}>
          Inserted content
        </div>
      )}
      <div
        data-testid="above"
        style={{ height: state.height, background: "#eee" }}
      >
        Content above
      </div>
    </>
  );
}

export function ListScrollElementRoute() {
  const { align, dynamic, element, htmlFull, index, noAnchor, sticky } =
    getParams();

  // Simulate a common CSS reset (the document no longer resizes with its content),
  // and browsers without scroll anchoring (e.g. Safari)
  useLayoutEffect(() => {
    if (htmlFull) {
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
    }
    if (noAnchor) {
      document.documentElement.style.overflowAnchor = "none";
    }
  }, [htmlFull, noAnchor]);

  const listRef = useListRef(null);
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: 25 });
  const isScrolling = useIsScrolling(element ? scroller : "window");

  const list = (
    <List
      children={
        sticky ? (
          <div
            data-testid="sticky"
            style={{
              position: "sticky",
              top: 0,
              height: 0,
              zIndex: 1
            }}
          >
            <div style={{ background: "yellow", height: 20 }}>Sticky</div>
          </div>
        ) : undefined
      }
      defaultHeight={600}
      listRef={listRef}
      overscanCount={0}
      rowComponent={Row}
      rowCount={500}
      rowHeight={dynamic ? dynamicRowHeight : 30}
      rowProps={{ dynamic }}
      scrollElement={element ? scroller : "window"}
    />
  );

  return (
    <>
      <div style={{ position: "fixed", right: 0, top: 0, zIndex: 2 }}>
        <button
          onClick={() =>
            listRef.current?.scrollToRow({ align, behavior: "smooth", index })
          }
        >
          Jump
        </button>
        <span data-testid="is-scrolling">{`${isScrolling}`}</span>
      </div>
      {element ? (
        <div
          data-testid="scroller"
          ref={setScroller}
          style={{
            height: 400,
            overflow: "auto",
            marginTop: 50,
            overflowAnchor: noAnchor ? "none" : undefined
          }}
        >
          <ChangingContentAbove />
          {/* Nested, so content that moves the list precedes one of its ancestors */}
          <section>
            <div>{list}</div>
          </section>
          <Spacer />
        </div>
      ) : (
        <>
          <ChangingContentAbove />
          <section>
            <div>{list}</div>
          </section>
          <Spacer />
        </>
      )}
    </>
  );
}

function Row({
  ariaAttributes,
  dynamic,
  index,
  style
}: RowComponentProps<{ dynamic: boolean }>) {
  return (
    <div
      {...ariaAttributes}
      data-index={index}
      style={{
        ...style,
        boxSizing: "border-box",
        borderBottom: "1px solid #ccc",
        height: dynamic ? 20 + (index % 7) * 10 : style.height
      }}
    >
      Row {index}
    </div>
  );
}

export function GridScrollElementRoute() {
  const { align, columnIndex, dir, full, index } = getParams();
  const gridRef = useGridRef(null);

  // Content can only be scrolled to on the document's end side, so an RTL page needs an RTL document
  useLayoutEffect(() => {
    if (dir) {
      document.documentElement.dir = dir;
    }
  }, [dir]);

  return (
    <div>
      <div style={{ position: "fixed", right: 0, top: 0, zIndex: 2 }}>
        <button
          onClick={() =>
            gridRef.current?.scrollToCell({
              columnAlign: align,
              columnIndex,
              rowAlign: align,
              rowIndex: index
            })
          }
        >
          Jump
        </button>
      </div>
      <Spacer />
      <Grid
        cellComponent={Cell}
        cellProps={{}}
        columnCount={100}
        columnWidth={100}
        defaultHeight={600}
        defaultWidth={1000}
        gridRef={gridRef}
        overscanCount={0}
        rowCount={500}
        rowHeight={30}
        scrollElement="window"
        style={full ? { width: "max-content" } : undefined}
      />
      <Spacer />
    </div>
  );
}

function Cell({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps<object>) {
  return (
    <div
      {...ariaAttributes}
      data-column={columnIndex}
      data-row={rowIndex}
      style={{
        ...style,
        boxSizing: "border-box",
        border: "1px solid #ddd"
      }}
    >
      {rowIndex},{columnIndex}
    </div>
  );
}
