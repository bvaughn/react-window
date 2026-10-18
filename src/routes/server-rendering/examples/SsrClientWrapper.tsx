// <begin>

// app/names/NamesList.tsx
"use client";

import { useCallback } from "react";
import { List, useDynamicRowHeight } from "react-window";
import { RowComponent } from "./RowComponent";

export function NamesList({ names }: { names: string[] }) {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 25
  });

  const rowKey = useCallback((index: number) => names[index], [names]);

  return (
    <List
      className="h-100"
      defaultHeight={400}
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={rowHeight}
      rowKey={rowKey}
      rowProps={{ names }}
    />
  );
}

// <end>
