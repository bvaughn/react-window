import type { RowProps } from "./ListVariableRowHeights";

// <begin>

function rowHeight(index: number, { items }: RowProps) {
  return items[index].type === "state" ? 30 : 25;
}

// <end>

export { rowHeight };
