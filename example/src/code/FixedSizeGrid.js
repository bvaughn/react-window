import { FixedSizeGrid as Grid } from 'react-virtualized';

<Grid
  columnCount={1000}
  columnWidth={100}
  height={150}
  rowCount={1000}
  rowHeight={35}
  width={300}
>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style}>
      row {rowIndex}, column {columnIndex}
    </div>
  )}
</Grid>