import { FixedSizeList as List } from 'react-virtualized';

<List
  cellSize={35}
  count={1000}
  height={150}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</List>