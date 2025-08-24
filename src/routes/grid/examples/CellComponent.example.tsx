import type { Contact } from "./Grid.example";
import { indexToColumn } from "./shared";

// <begin>

import { type CellComponentProps } from "react-window";

function CellComponent({
  contacts,
  columnIndex,
  rowIndex,
  style
}: CellComponentProps<{
  contacts: Contact[];
}>) {
  const address = contacts[rowIndex];
  const content = address[indexToColumn(columnIndex)];

  return (
    <div className="truncate" style={style}>
      {content}
    </div>
  );
}

// <end>

export { CellComponent };
