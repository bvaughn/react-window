// <begin>

// app/names/RowComponent.tsx
"use client";

import { type RowComponentProps } from "react-window";

export function RowComponent({
  ariaAttributes,
  index,
  names,
  style
}: RowComponentProps<{ names: string[] }>) {
  return (
    <div {...ariaAttributes} style={style}>
      {names[index]}
    </div>
  );
}

// <end>
