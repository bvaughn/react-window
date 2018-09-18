import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeList as List } from 'react-window';

import './styles.css';

const Row = ({ index, isScrolling, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    {isScrolling ? 'Scrolling' : `Row ${index}`}
  </div>
);

const Example = () => (
  <List
    className="List"
    height={150}
    itemCount={1000}
    itemSize={35}
    useIsScrolling
    width={300}
  >
    {Row}
  </List>
);

ReactDOM.render(<Example />, document.getElementById('root'));
