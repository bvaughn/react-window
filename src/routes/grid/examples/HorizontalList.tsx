import { CellComponent } from "./HorizontalListCellRenderer";

// <begin>

import { Grid } from "react-window";

function HorizontalList({ emails }: { emails: string[] }) {
  return (
    <Grid
      cellComponent={CellComponent}
      cellProps={{ emails }}
      columnCount={emails.length}
      columnWidth={150}
      rowCount={1}
      rowHeight="100%"
    />
  );
}

// <end>

export { HorizontalList };
