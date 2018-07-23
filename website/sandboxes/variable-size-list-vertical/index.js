import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

import './styles.css';

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowSizes = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

const App = () => (
  <List
    className="List"
    height={150}
    itemCount={1000}
    itemSize={index => rowSizes[index]}
    width={300}
  >
    {({ index, style }) => (
      <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
        Row {index}
      </div>
    )}
  </List>
);

ReactDOM.render(<App />, document.getElementById('root'));
