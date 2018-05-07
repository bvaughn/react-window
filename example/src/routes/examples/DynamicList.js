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
import { DynamicList } from 'react-virtualized';

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
      className={index % 2 ? 'ItemOdd' : 'ItemEven'}
      key={key}
      style={style}
    >
      Row {index}
    </div>
  )}
</DynamicList>
`;
