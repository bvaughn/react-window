import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
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
  grow: boolean;
  ids: readonly number[];
};

const INITIAL_IDS = Array.from({ length: ROW_COUNT }, (_, index) => index);

// Rows with heights from 40 to 160px (estimated at 50px), scrolled to the bottom on mount.
// - "grow": rows first render at half height and reach their full height 150ms later
// - "keys": passes rowKey (so that row heights and positions follow their rows when rows are inserted or removed)
// - "window": scrolls with the page (below some other content)
// Tests toggle a row's expanded state (100px taller) by dispatching an "expand" event,
// e.g. { detail: { index: 10 } }, or { detail: { index: 10, anchor: { index: 12 } } } to call anchorRow({ index: 12 }) first
// Rows are identified by a data-id attribute that doesn't change when rows are inserted or removed before them.
// Tests insert rows at the start by dispatching a "prepend" event, e.g. { detail: { count: 20 } };
// with { detail: { count: 20, trim: 20 } }, as many rows are removed from the end (keeping the row count the same).
// With { detail: { count: 20, correct: true } }, the scroll position is adjusted by the change in scroll height
// (the way an app that loads older messages might keep its place)
// Tests insert or remove rows elsewhere by dispatching an "insert" or "remove" event, e.g. { detail: { count: 5, index: 10 } }
// Tests call scrollToRow by dispatching a "scroll-to-row" event, e.g. { detail: { behavior: "smooth", index: 10 } }
export function ListAnchorRoute() {
  const params = new URLSearchParams(location.search);
  const grow = params.has("grow");
  const isWindow = params.has("window");

  const listRef = useListRef(null);
  const rowHeight = useDynamicRowHeight({ defaultRowHeight: 50 });

  const [expanded, setExpanded] = useState<ReadonlySet<number>>(new Set());
  const [ids, setIds] = useState<readonly number[]>(INITIAL_IDS);
  const idsRef = useRef(ids);
  useLayoutEffect(() => {
    idsRef.current = ids;
  }, [ids]);
  // Ids for inserted rows (that don't overlap with others)
  const nextIdRef = useRef(100_000);

  const rowKey = useCallback(
    (index: number, { ids }: RowProps) => ids[index],
    []
  );

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
      // Rows stay expanded (by id) when rows are inserted or removed before them
      const id = idsRef.current[index];
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    };
    const onPrepend = (event: Event) => {
      const {
        correct = false,
        count,
        trim = 0
      } = (
        event as CustomEvent<{
          correct?: boolean;
          count: number;
          trim?: number;
        }>
      ).detail;
      if (correct) {
        prevScrollHeightRef.current =
          listRef.current?.element?.scrollHeight ?? null;
      }
      setIds((prev) => [
        ...Array.from({ length: count }, (_, index) => prev[0] - count + index),
        ...prev.slice(0, prev.length - trim)
      ]);
    };
    const onInsert = (event: Event) => {
      const { count, index } = (
        event as CustomEvent<{ count: number; index: number }>
      ).detail;
      const inserted = Array.from({ length: count }, () => nextIdRef.current++);
      setIds((prev) => [
        ...prev.slice(0, index),
        ...inserted,
        ...prev.slice(index)
      ]);
    };
    const onRemove = (event: Event) => {
      const { count, index } = (
        event as CustomEvent<{ count: number; index: number }>
      ).detail;
      setIds((prev) => [...prev.slice(0, index), ...prev.slice(index + count)]);
    };
    const onScrollToRow = (event: Event) => {
      listRef.current?.scrollToRow(
        (event as CustomEvent<Parameters<ListImperativeAPI["scrollToRow"]>[0]>)
          .detail
      );
    };
    window.addEventListener("expand", onExpand);
    window.addEventListener("insert", onInsert);
    window.addEventListener("prepend", onPrepend);
    window.addEventListener("remove", onRemove);
    window.addEventListener("scroll-to-row", onScrollToRow);
    return () => {
      window.removeEventListener("expand", onExpand);
      window.removeEventListener("insert", onInsert);
      window.removeEventListener("prepend", onPrepend);
      window.removeEventListener("remove", onRemove);
      window.removeEventListener("scroll-to-row", onScrollToRow);
    };
  }, [listRef]);

  useLayoutEffect(() => {
    const element = listRef.current?.element;
    if (element && prevScrollHeightRef.current !== null) {
      element.scrollTop += element.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
    }
  }, [ids, listRef]);

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
        rowCount={ids.length}
        rowHeight={rowHeight}
        rowKey={params.has("keys") ? rowKey : undefined}
        rowProps={{ expanded, grow, ids }}
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
  grow,
  ids,
  index,
  style
}: RowComponentProps<RowProps>) {
  const id = ids[index];

  const [isGrown, setIsGrown] = useState(!grow);

  useEffect(() => {
    if (!isGrown) {
      const timeoutId = setTimeout(() => setIsGrown(true), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isGrown]);

  const height =
    (40 + ((((id * 37) % 7) + 7) % 7) * 20) / (isGrown ? 1 : 2) +
    (expanded.has(id) ? 100 : 0);

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
