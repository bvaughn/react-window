import { DynamicList as List } from 'react-virtualized';

// This is a silly row height function.
// Yours would probably return a height based on the item.
function getRowHeight(index) {
  return 20 + index % 3 * 5;
}

<List
  cellSize={getRowHeight}
  count={1000}
  height={150}
  width={300}
>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      Row {index}
    </div>
  )}
</List>