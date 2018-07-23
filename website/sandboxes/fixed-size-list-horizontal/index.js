import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeList as List } from 'react-window';

import './styles.css';

const App = () => (
  <List
    className="List"
    direction="horizontal"
    height={75}
    itemCount={1000}
    itemSize={100}
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
