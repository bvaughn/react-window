import { FixedSizeList as List } from 'react-window';

<List
  height={150}
  itemCount={1000}
  itemSize={35}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      Row {index}
    </div>
  )}
</List>