import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeList as List } from 'react-window';

import './styles.css';

const App = () => (
  <List
    className="List"
    height={150}
    itemCount={1000}
    itemSize={35}
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
