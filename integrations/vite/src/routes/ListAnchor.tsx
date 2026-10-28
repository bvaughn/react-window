import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  List,
  useDynamicRowHeight,
  useListRef,
  type ListImperativeAPI,
  type RowComponentProps
} from "react-window";

const ROW_COUNT = 200;

type RowProps = {
  expanded: ReadonlySet<number>;
  firstId: number;
  grow: boolean;
};

// Rows with heights from 40 to 160px (estimated at 50px), scrolled to the bottom on mount.
// - "grow": rows first render at half height and reach their full height 150ms later
// - "window": scrolls with the page (below some other content)
// Tests toggle a row's expanded state (100px taller) by dispatching an "expand" event,
// e.g. { detail: { index: 10 } }, or { detail: { index: 10, anchor: { index: 12 } } } to call anchorRow({ index: 12 }) first
// Tests insert rows at the start by dispatching a "prepend" event, e.g. { detail: { count: 20 } };
// rows are identified by a data-id attribute that doesn't change when rows are inserted before them.
// With { detail: { count: 20, correct: true } }, the scroll position is adjusted by the change in scroll height
// (the way an app that loads older messages might keep its place)
// Tests call scrollToRow by dispatching a "scroll-to-row" event, e.g. { detail: { behavior: "smooth", index: 10 } }
export function ListAnchorRoute() {
  const params = new URLSearchParams(location.search);
  const grow = params.has("grow");
  const isWindow = params.has("window");

  const listRef = useListRef(null);
  const rowHeight = useDynamicRowHeight({ defaultRowHeight: 50 });

  const [expanded, setExpanded] = useState<ReadonlySet<number>>(new Set());
  const [firstId, setFirstId] = useState(0);
  const [rowCount, setRowCount] = useState(ROW_COUNT);

  // Scroll height before rows were prepended, for apps that adjust the scroll position themselves
  const prevScrollHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const onExpand = (event: Event) => {
      const { anchor, index } = (
        event as CustomEvent<{
          anchor?: { duration?: number; index: number };
          index: number;
        }>
      ).detail;
      if (anchor !== undefined) {
        listRef.current?.anchorRow(anchor);
      }
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    };
    const onPrepend = (event: Event) => {
      const { correct = false, count } = (
        event as CustomEvent<{ correct?: boolean; count: number }>
      ).detail;
      if (correct) {
        prevScrollHeightRef.current =
          listRef.current?.element?.scrollHeight ?? null;
      }
      setFirstId((prev) => prev - count);
      setRowCount((prev) => prev + count);
    };
    const onScrollToRow = (event: Event) => {
      listRef.current?.scrollToRow(
        (event as CustomEvent<Parameters<ListImperativeAPI["scrollToRow"]>[0]>)
          .detail
      );
    };
    window.addEventListener("expand", onExpand);
    window.addEventListener("prepend", onPrepend);
    window.addEventListener("scroll-to-row", onScrollToRow);
    return () => {
      window.removeEventListener("expand", onExpand);
      window.removeEventListener("prepend", onPrepend);
      window.removeEventListener("scroll-to-row", onScrollToRow);
    };
  }, [listRef]);

  useLayoutEffect(() => {
    const element = listRef.current?.element;
    if (element && prevScrollHeightRef.current !== null) {
      element.scrollTop += element.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
    }
  }, [listRef, rowCount]);

  // The list's element is set after it first renders
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      listRef.current?.scrollToRow({ align: "end", index: ROW_COUNT - 1 })
    );
    return () => cancelAnimationFrame(id);
  }, [listRef]);

  return (
    <>
      {isWindow && <div style={{ height: 300 }}>Content above</div>}
      <List
        listRef={listRef}
        rowComponent={Row}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowProps={{ expanded, firstId, grow }}
        scrollElement={isWindow ? "window" : undefined}
        style={{
          ...(isWindow ? { width: 300 } : { height: 400, width: 300 }),
          // Disable the browser's own scroll anchoring
          ...(params.has("no-native-anchor") && { overflowAnchor: "none" })
        }}
      />
    </>
  );
}

function Row({
  ariaAttributes,
  expanded,
  firstId,
  grow,
  index,
  style
}: RowComponentProps<RowProps>) {
  const id = firstId + index;

  const [isGrown, setIsGrown] = useState(!grow);

  useEffect(() => {
    if (!isGrown) {
      const timeoutId = setTimeout(() => setIsGrown(true), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isGrown]);

  const height =
    (40 + ((((id * 37) % 7) + 7) % 7) * 20) / (isGrown ? 1 : 2) +
    (expanded.has(index) ? 100 : 0);

  return (
    <div
      {...ariaAttributes}
      data-id={id}
      data-index={index}
      style={{
        ...style,
        borderBottom: "1px solid",
        boxSizing: "border-box",
        height
      }}
    >
      Row {id}
    </div>
  );
}
