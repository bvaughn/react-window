import { useState } from "react";
import { useDynamicRowHeight, useVirtualizer } from "react-window";

const ROW_COUNT = 1000;

// A semantic <table> rendered with the headless hook (rows in normal flow between spacer rows)
export function HeadlessTableRoute() {
  const params = new URLSearchParams(location.search);
  const isWindow = params.has("window");
  const isDynamic = params.has("dynamic");
  // Scroll padding that matches the height of the sticky header
  const scrollPaddingTop = params.has("padding") ? 30 : undefined;

  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [tbody, setTbody] = useState<HTMLTableSectionElement | null>(null);
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: 30 });

  const { items, measureElement, scrollToIndex, totalSize } = useVirtualizer({
    count: ROW_COUNT,
    defaultSize: 400,
    element: tbody,
    itemSize: isDynamic ? dynamicRowHeight : 30,
    overscanCount: 0,
    scrollElement: isWindow ? "window" : scroller
  });

  const first = items[0];
  const last = items[items.length - 1];
  const spaceBefore = first ? first.offset : 0;
  const spaceAfter = last ? totalSize - last.offset - last.size : 0;

  if (isWindow && scrollPaddingTop) {
    document.documentElement.style.scrollPaddingTop = `${scrollPaddingTop}px`;
  }

  const table = (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead
        data-testid="thead"
        style={{ background: "teal", position: "sticky", top: 0 }}
      >
        <tr style={{ height: 30 }}>
          <th>Index</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody ref={setTbody}>
        {spaceBefore > 0 && <tr aria-hidden style={{ height: spaceBefore }} />}
        {items.map(({ index, size }) => (
          <tr
            data-index={index}
            key={index}
            ref={isDynamic ? measureElement : undefined}
            style={{ height: isDynamic ? 20 + (index % 5) * 10 : size }}
          >
            <td>{index}</td>
            <td>Row {index}</td>
          </tr>
        ))}
        {spaceAfter > 0 && <tr aria-hidden style={{ height: spaceAfter }} />}
      </tbody>
    </table>
  );

  return (
    <>
      <div style={{ position: "fixed", right: 0, top: 0, zIndex: 2 }}>
        <button
          onClick={() =>
            scrollToIndex({
              align: (params.get("align") ?? "center") as "center",
              index: Number(params.get("index") ?? 500)
            })
          }
        >
          Jump
        </button>
      </div>
      <div style={{ height: 200 }}>Content above</div>
      {isWindow ? (
        table
      ) : (
        <div
          data-testid="scroller"
          ref={setScroller}
          style={{ height: 400, overflow: "auto", scrollPaddingTop }}
        >
          {table}
        </div>
      )}
    </>
  );
}
