import json from "../../../../public/data/arabic-countries.json";
import { columnWidth } from "./columnWidth.example";

type Country = (typeof json)[0];

// <begin>

import { Grid, type CellComponentProps } from "react-window";

function RtlExample({ countries }: { countries: Country[] }) {
  return (
    <Grid
      cellComponent={CellComponent}
      cellProps={{ countries }}
      columnCount={countries.length}
      columnWidth={columnWidth}
      dir="rtl"
      rowCount={1}
      rowHeight="100%"
    />
  );
}

// <end>

function CellComponent({
  columnIndex,
  countries,
  style
}: CellComponentProps<{ countries: Country[] }>) {
  return (
    <div style={style}>
      ({columnIndex}) {countries[columnIndex]}
    </div>
  );
}

export { RtlExample };
