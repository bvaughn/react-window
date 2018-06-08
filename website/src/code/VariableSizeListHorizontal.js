import { VariableSizeList as List } from 'react-window';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

<List
  direction="horizontal"
  height={75}
  itemCount={1000}
  itemSize={index => columnWidths[index]}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Column {index}
    </div>
  )}
</List>