import { FixedSizeList as List } from 'react-window';

<List
  direction="horizontal"
  height={75}
  itemCount={1000}
  itemSize={100}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Column {index}
    </div>
  )}
</List>