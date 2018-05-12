import React from "react";
import { FixedSizeGrid } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import "./shared.css";

export default function() {
  return (
    <div className="ExampleWrapper">
    <div className="Example">
      <div className="ExampleDemo">
        <FixedSizeGrid
          className="Grid"
          columnCount={1000}
          columnWidth={100}
          height={150}
          rowCount={1000}
          rowHeight={35}
          width={300}
        >
          {({ columnIndex, key, rowIndex, style }) => (
            <div
              className={columnIndex % 2 ? (rowIndex % 2 === 0 ? 'GridItemOdd' : 'GridItemEven') : (rowIndex % 2 ? 'GridItemOdd' : 'GridItemEven')}
              key={key}
              style={style}
            >
              r{rowIndex}, c{columnIndex}
            </div>
          )}
        </FixedSizeGrid>

        <div className="TryItOutLink">
          <CodeSandboxLink to="#" />
        </div>
      </div>
      <div className="ExampleCode">
        <CodeBlock value={SNIPPET} />
      </div>
    </div>
    </div>
  );
}

const SNIPPET = `
import { FixedSizeGrid as Grid } from 'react-virtualized';

<Grid
  columnCount={1000}
  columnWidth={100}
  height={150}
  rowCount={1000}
  rowHeight={35}
  width={300}
>
  {({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
      row {rowIndex}, column {columnIndex}
    </div>
  )}
</Grid>
`;