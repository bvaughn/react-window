import React from "react";
import { DynamicGrid } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import CODE from "../../code/DynamicGrid.js";

import "./shared.css";

const columnWidths = new Array(1000).fill(true).map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

export default function() {
  return (
    <div className="ExampleWrapper">
      <h1 className="ExampleHeader">Dynamic Grid</h1>
      <div className="Example">
        <div className="ExampleDemo">
          <DynamicGrid
            className="Grid"
            columnCount={1000}
            columnWidth={index => columnWidths[index]}
            height={150}
            rowCount={1000}
            rowHeight={index => rowHeights[index]}
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

          <CodeSandboxLink className="TryItOutLink" id="241m0vromp" />
        </div>
        <div className="ExampleCode">
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
