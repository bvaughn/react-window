import { FixedSizeList as List } from 'react-virtualized';

<List
  count={1000}
  height={150}
  itemSize={35}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</List>