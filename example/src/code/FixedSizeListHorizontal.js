import { FixedSizeList as List } from 'react-virtualized';

<List
  cellSize={100}
  count={1000}
  direction="horizontal"
  height={75}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Column {index}
    </div>
  )}
</List>