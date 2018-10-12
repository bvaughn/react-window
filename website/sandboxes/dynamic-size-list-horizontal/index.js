import React from 'react';
import ReactDOM from 'react-dom';
import { DynamicSizeList as List } from 'react-window';
import loremIpsum from 'lorem-ipsum';

import './styles.css';

// This example uses an array of random strings,
// But the list can also contain data that's async loaded, like images.
const items = new Array(500)
  .fill(true)
  .map(() => loremIpsum({ units: 'words', count: 3 }));

const Column = ({ data, index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    {data[index]}
  </div>
);

const Example = () => (
  <List
    className="List"
    direction="horizontal"
    height={50}
    itemCount={items.length}
    itemData={items}
    width={300}
  >
    {Column}
  </List>
);

ReactDOM.render(<Example />, document.getElementById('root'));
