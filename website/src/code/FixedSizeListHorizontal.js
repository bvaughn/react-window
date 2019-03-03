import { FixedSizeList as List } from 'react-window';

const Column = ({ index, style }) => (
  <div style={style}>Column {index}</div>
);

const Example = () => (
  <List
    height={75}
    itemCount={1000}
    itemSize={100}
    layout="horizontal"
    width={300}
  >
    {Column}
  </List>
);