import React from "react";
import { FixedSizeGrid } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import "./shared.css";

export default function() {
  return (
    <div class="ExampleWrapper">
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
              className="GridItem"
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
      className="GridItem"
      key={key}
      style={style}
    >
      r{rowIndex}, c{columnIndex}
    </div>
  )}
</FixedSizeGrid>
`;