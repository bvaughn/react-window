import { useState } from "react";
import {
  List,
  useDynamicRowHeight,
  useListRef,
  type RowComponentProps
} from "react-window";

export function ListDynamicRoute() {
  const params = new URLSearchParams(location.search);
  const listRef = useListRef(null);
  const [rowCount, setRowCount] = useState(500);
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: Number(params.get("estimate") ?? 25)
  });
  return (
    <>
      <button
        onClick={() =>
          listRef.current?.scrollToRow({
            index: Number(params.get("index") ?? 250),
            align: (params.get("align") ?? "auto") as
              | "auto"
              | "start"
              | "center"
              | "end"
              | "smart",
            behavior: "smooth"
          })
        }
      >
        Jump
      </button>
      <button
        onClick={() =>
          listRef.current?.scrollToRow({ index: 20, align: "start" })
        }
      >
        Replace
      </button>
      <button onClick={() => setRowCount(10)}>Shrink</button>
      <List
        children={
          params.has("overlay") ? (
            <div
              data-testid="overlay"
              style={{ position: "absolute", height: 10 }}
            >
              Overlay
            </div>
          ) : undefined
        }
        listRef={listRef}
        style={{ height: 200, width: 300 }}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowComponent={Row}
        rowProps={{ tall: params.has("tall") }}
      />
    </>
  );
}

function Row({
  index,
  style,
  ariaAttributes,
  tall
}: RowComponentProps<{ tall: boolean }>) {
  return (
    <div
      {...ariaAttributes}
      data-index={index}
      style={{ ...style, height: tall ? 300 : 20 + (index % 7) * 10 }}
    >
      Row {index}
    </div>
  );
}
