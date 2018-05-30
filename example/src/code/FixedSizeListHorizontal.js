import { FixedSizeList as List } from 'react-virtualized';

<List
  count={1000}
  direction="horizontal"
  height={75}
  itemSize={100}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Column {index}
    </div>
  )}
</List>