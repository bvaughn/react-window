import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

import './styles.css';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnSizes = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

const getItemSize = index => columnSizes[index];

const Column = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Column {index}
  </div>
);

const Example = () => (
  <List
    className="List"
    direction="horizontal"
    height={75}
    itemCount={1000}
    itemSize={getItemSize}
    width={300}
  >
    {Column}
  </List>
);

ReactDOM.render(<Example />, document.getElementById('root'));
