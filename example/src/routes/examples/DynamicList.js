import React from "react";
import { DynamicList } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import CODE_HORIZONTAL from "../../code/DynamicListHorizontal.js";
import CODE_VERTICAL from "../../code/DynamicListVertical.js";

import "./shared.css";

const columnSizes = new Array(1000).fill(true).map(() => 75 + Math.round(Math.random() * 50));
const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

export default function() {
  return (
    <div className="ExampleWrapper">
      <div className="Example">
        <div className="ExampleDemo">
          <DynamicList
            cellSize={index => rowSizes[index]}
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
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className="Example">
        <div className="ExampleDemo">
          <DynamicList
            cellSize={index => columnSizes[index]}
            className="List"
            direction="horizontal"
            count={1000}
            height={75}
            width={300}
          >
            {({ key, index, style }) => (
              <div
                className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                key={key}
                style={style}
              >
                Column {index}
              </div>
            )}
          </DynamicList>

          <div className="TryItOutLink">
            <CodeSandboxLink to="#" />
          </div>
        </div>
        <div className="ExampleCode">
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
