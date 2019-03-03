import { FixedSizeList as List } from 'react-window';

const Column = ({ index, style }) => (
  <div style={style}>Column {index}</div>
);

const Example = () => (
  <List
    direction="horizontal"
    height={75}
    itemCount={1000}
    itemSize={100}
    width={300}
    style={{ direction: "rtl" }}
  >
    {Column}
  </List>
);
