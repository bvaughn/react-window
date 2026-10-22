import { CellComponent } from "./CellComponent";
import { columnWidth } from "./columnWidth";
import type { Contact } from "./Grid";

// <begin>

import { Grid } from "react-window";

function Example({ contacts }: { contacts: Contact[] }) {
  return (
    <Grid
      cellComponent={CellComponent}
      cellProps={{ contacts }}
      columnCount={10}
      columnWidth={columnWidth}
      rowCount={contacts.length}
      rowHeight={25}
      scrollElement="window"
      // Columns scroll within the grid unless it is as wide as its content
      style={{ width: "max-content" }}
    />
  );
}

// <end>

export { Example };
