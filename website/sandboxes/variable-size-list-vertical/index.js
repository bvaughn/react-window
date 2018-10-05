import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

import './styles.css';

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowSizes = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

const getItemSize = index => rowSizes[index];

const Row = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Row {index}
  </div>
);

const Example = () => (
  <List
    className="List"
    height={150}
    itemCount={1000}
    itemSize={getItemSize}
    width={300}
  >
    {Row}
  </List>
);

ReactDOM.render(<Example />, document.getElementById('root'));
