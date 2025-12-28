import json from "../../../../public/data/contacts.json";
import { CellComponent } from "./CellComponent";
import { columnWidth } from "./columnWidth";

type Contact = (typeof json)[0];

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
    />
  );
}

// <end>

export { CellComponent, Example };
export type { Contact };
