import { VariableSizeList as List } from 'react-window';

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

<List
  height={150}
  itemCount={1000}
  itemSize={index => rowHeights[index]}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</List>