// <begin>

// app/names/RowComponent.tsx
"use client";

import { type RowComponentProps } from "react-window";

export function RowComponent({
  index,
  names,
  style
}: RowComponentProps<{ names: string[] }>) {
  return <div style={style}>{names[index]}</div>;
}

// <end>
