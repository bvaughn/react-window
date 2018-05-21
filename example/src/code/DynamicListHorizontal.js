import { DynamicList as List } from 'react-virtualized';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

<List
  cellSize={index => columnWidths[index]}
  count={1000}
  direction="horizontal"
  height={75}
  width={300}
>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      Column {index}
    </div>
  )}
</List>