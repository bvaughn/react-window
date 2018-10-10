import { DynamicSizeList as List } from 'react-window';

// This example assumes 'items' is an array of strings.
// Your application may render a more complex list of items.
const Row = ({ index, style }) => (
  <div style={style}>items[index]</div>
);

const Example = () => (
  <List
    height={150}
    itemCount={1000}
    width={300}
  >
    {Row}
  </List>
);