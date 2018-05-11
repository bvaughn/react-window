import React from "react";
import { DynamicList } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import "./shared.css";

export default function() {
  return (
    <div className="ExampleWrapper">
      <div className="Example">
        <div className="ExampleDemo">
          <DynamicList
            cellSize={
              (index) => 20 + index % 3 * 5
            }
            className="List"
            count={1000}
            height={150}
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
          </DynamicList>

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
import { DynamicList as List } from 'react-virtualized';

// This is a silly row height function.
// Yours would probably return a height based on the item.
function getRowHeight(index) {
  return 20 + index % 3 * 5;
}

<List
  cellSize={getRowHeight}
  count={1000}
  height={150}
  width={300}
>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      Row {index}
    </div>
  )}
</List>
`;
