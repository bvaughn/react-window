import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

import './styles.css';

// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnSizes = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));

const App = () => (
  <List
    className="List"
    direction="horizontal"
    height={75}
    itemCount={1000}
    itemSize={index => columnSizes[index]}
    width={300}
  >
    {({ index, style }) => (
      <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
        Column {index}
      </div>
    )}
  </List>
);

ReactDOM.render(<App />, document.getElementById('root'));
