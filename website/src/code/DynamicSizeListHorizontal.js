import { DynamicSizeList as List } from 'react-window';

// This example assumes 'items' is an array of strings.
// Your application may render a more complex list of items.

<List
  direction="horizontal"
  height={150}
  itemCount={1000}
  width={300}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  )}
</List>