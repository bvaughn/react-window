// <begin>

import { useMemo, useState } from "react";
import { List, useDynamicRowHeight } from "react-window";
import { RowComponent } from "./ListRowDynamicRowHeights";

function Example({ lorem }: { lorem: string[] }) {
  const listState = useListState(lorem);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 50
  });

  return (
    <List
      rowComponent={RowComponent}
      rowCount={lorem.length}
      rowHeight={rowHeight}
      rowProps={{ listState }}
    />
  );
}

// <end>

export type ListState = {
  getText: (index: number) => string;
  isRowCollapsed: (index: number) => boolean;
  toggleRow: (index: number) => void;
};

function useListState(lorem: string[]) {
  const [set, updateSet] = useState<Set<number>>(new Set());

  return useMemo<ListState>(
    () => ({
      getText: (index: number) => lorem[index],
      isRowCollapsed: (index: number) => set.has(index),
      toggleRow: (index: number) => {
        updateSet((prevSet) => {
          const cloned = new Set(prevSet);
          if (cloned.has(index)) {
            cloned.delete(index);
          } else {
            cloned.add(index);
          }
          return cloned;
        });
      }
    }),
    [lorem, set]
  );
}

export { Example };
