import type { Contact } from "./Grid";
import { CellComponent } from "./HorizontalListCellRenderer";

// <begin>

import { Grid } from "react-window";

function HorizontalList({ contacts }: { contacts: Contact[] }) {
  return (
    <Grid
      className="h-full"
      cellComponent={CellComponent}
      cellProps={{ contacts }}
      columnCount={contacts.length}
      columnWidth={160}
      rowCount={1}
      rowHeight="100%"
    />
  );
}

// <end>

export { HorizontalList };
