import { VariableSizeList as List } from 'react-window';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

const getItemSize = index => columnWidths[index];

const Column = ({ index, style }) => (
  <div style={style}>Column {index}</div>
);

const Example = () => (
  <List
    height={75}
    itemCount={1000}
    itemSize={getItemSize}
    layout="horizontal"
    width={300}
  >
    {Column}
  </List>
);