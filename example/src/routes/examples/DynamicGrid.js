import React from "react";
import { DynamicGrid } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import CODE from "../../code/DynamicGrid.js";

import "./shared.css";

const columnSizes = new Array(1000).fill(true).map(() => 75 + Math.round(Math.random() * 50));
const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

export default function() {
  return (
    <div className="ExampleWrapper">
    <div className="Example">
      <div className="ExampleDemo">
        <DynamicGrid
          className="Grid"
          columnCount={1000}
          columnWidth={index => columnSizes[index]}
          height={150}
          rowCount={1000}
          rowHeight={index => rowSizes[index]}
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
        </DynamicGrid>

        <CodeSandboxLink className="TryItOutLink" id="1rp83rw8wl" />
      </div>
      <div className="ExampleCode">
        <CodeBlock value={CODE} />
      </div>
    </div>
    </div>
  );
}
