"use client";

import { type RowComponentProps } from "react-window";

export function RowComponent({
  ariaAttributes,
  index,
  style
}: RowComponentProps<object>) {
  return (
    <div className="flex items-center gap-1" style={style} {...ariaAttributes}>
      Row {index}
    </div>
  );
}
