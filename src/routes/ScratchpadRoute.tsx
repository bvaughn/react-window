import { useState } from "react";
import {
  List,
  useListCallbackRef,
  type ListImperativeAPI,
  type RowComponentProps
} from "react-window";

export function ScratchpadRoute() {
  const [heights, setHeights] = useState<number[]>([20, 40, 20, 20, 30]);

  const [listRef, setListRef] = useListCallbackRef(null);

  return (
    <div
      onClick={() => {
        setHeights((prev) => [...prev].reverse());
      }}
    >
      <List
        listRef={setListRef}
        rowComponent={RowComponent}
        rowCount={heights.length}
        rowHeight={rowHeight}
        rowProps={{ heights, listRef }}
      />
    </div>
  );
}

type RowProps = { heights: number[]; listRef: ListImperativeAPI | null };

function rowHeight(index: number, { heights }: RowProps) {
  return heights[index];
}
function RowComponent({ index, heights, style }: RowComponentProps<RowProps>) {
  return (
    <div
      className="flex flex-row items-center gap-4 border border-1"
      style={style}
    >
      Row {index} ({heights[index]})
    </div>
  );
}
