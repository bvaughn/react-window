import { VariableSizeList as List } from 'react-virtualized';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

<List
  count={1000}
  direction="horizontal"
  height={75}
  itemSize={index => columnWidths[index]}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Column {index}
    </div>
  )}
</List>