import { FixedSizeList as List } from 'react-virtualized';

<List
  cellSize={35}
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