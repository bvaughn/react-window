"use client";

import { type CellComponentProps } from "react-window";

export function CellComponent({
  ariaAttributes,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps<object>) {
  return (
    <div className="flex items-center gap-1" style={style} {...ariaAttributes}>
      Cell {rowIndex}, {columnIndex}
    </div>
  );
}
