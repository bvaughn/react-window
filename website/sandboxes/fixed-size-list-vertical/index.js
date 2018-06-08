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
    {({ key, index, style }) => (
      <div
        className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
        key={key}
        style={style}
      >
        Row {index}
      </div>
    )}
  </List>
);

ReactDOM.render(<App />, document.getElementById('root'));
