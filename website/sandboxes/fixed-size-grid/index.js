import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeGrid as Grid } from 'react-window';

import './styles.css';

const App = () => (
  <Grid
    className="Grid"
    columnCount={1000}
    columnWidth={100}
    height={150}
    rowCount={1000}
    rowHeight={35}
    width={300}
  >
    {({ columnIndex, rowIndex, style }) => (
      <div
        className={
          columnIndex % 2
            ? rowIndex % 2 === 0
              ? 'GridItemOdd'
              : 'GridItemEven'
            : rowIndex % 2
              ? 'GridItemOdd'
              : 'GridItemEven'
        }
        style={style}
      >
        r{rowIndex}, c{columnIndex}
      </div>
    )}
  </Grid>
);

ReactDOM.render(<App />, document.getElementById('root'));
