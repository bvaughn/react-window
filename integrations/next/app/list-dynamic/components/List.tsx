"use client";

import { List as ListExternal, useDynamicRowHeight } from "react-window";
import { RowComponent } from "./RowComponent";

export function List() {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 30
  });

  return (
    <ListExternal
      className="h-[250px]"
      defaultHeight={250}
      overscanCount={0}
      rowComponent={RowComponent}
      rowCount={100}
      rowHeight={rowHeight}
      rowProps={{}}
    />
  );
}
