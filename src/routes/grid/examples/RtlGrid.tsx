import json from "../../../../public/data/contacts.json";
import { columnWidth } from "./columnWidth";

type Contact = (typeof json)[0];

// <begin>

import { Grid } from "react-window";

function RtlExample({ contacts }: { contacts: Contact[] }) {
  return (
    <Grid
      cellComponent={CellComponent}
      cellProps={{ contacts }}
      columnCount={10}
      columnWidth={columnWidth}
      dir="rtl"
      rowCount={contacts.length}
      rowHeight={35}
    />
  );
}

// <end>

import { type CellComponentProps } from "react-window";
import { indexToColumn } from "./shared";

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
    <div className="truncate leading-none" style={style}>
      <div>{content}</div>
      <small className="text-slate-400">
        row {rowIndex}, col {columnIndex}
      </small>
    </div>
  );
}

export { CellComponent, RtlExample };
export type { Contact };
