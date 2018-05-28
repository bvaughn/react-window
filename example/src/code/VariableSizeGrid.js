import { FixedSizeGrid as Grid } from 'react-virtualized';

// These cell sizes are arbitrary.
// Yours should be based on the content of the cell.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

<Grid
  columnCount={1000}
  columnWidth={index => columnWidths[index]}
  height={150}
  rowCount={1000}
  rowHeight={index => rowHeights[index]}
  width={300}
>
  {({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
      row {rowIndex}, column {columnIndex}
    </div>
  )}
</Grid>