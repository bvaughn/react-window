import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeGrid as Grid } from 'react-window';

import './styles.css';

// These cell sizes are arbitrary.
// Yours should be based on the content of the cell.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

const App = () => (
  <Grid
    className="Grid"
    columnCount={1000}
    columnWidth={index => columnWidths[index]}
    height={150}
    rowCount={1000}
    rowHeight={index => rowHeights[index]}
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
