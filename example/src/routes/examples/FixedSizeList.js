import React from "react";
import { FixedSizeList } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import "./shared.css";

export default function() {
  return (
    <div class="ExampleWrapper">
    <div className="Example">
      <div className="ExampleDemo">
        <FixedSizeList
          cellSize={35}
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
        </FixedSizeList>

        <div className="TryItOutLink">
          <CodeSandboxLink to="#" />
        </div>
      </div>
      <div className="ExampleCode">
        <CodeBlock value={SNIPPET_VERTICAL} />
      </div>
    </div>
    <div className="Example">
      <div className="ExampleDemo">
        <FixedSizeList
          cellSize={100}
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
        </FixedSizeList>

        <div className="TryItOutLink">
          <CodeSandboxLink to="#" />
        </div>
      </div>
      <div className="ExampleCode">
        <CodeBlock value={SNIPPET_HORIZONTAL} />
      </div>
    </div>
    </div>
  );
}

const SNIPPET_VERTICAL = `
import { FixedSizeList } from 'react-virtualized';

<FixedSizeList
  cellSize={35}
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
</FixedSizeList>
`;

const SNIPPET_HORIZONTAL = `
import { FixedSizeList } from 'react-virtualized';

<FixedSizeList
  cellSize={100}
  className="List"
  count={1000}
  direction="horizontal"
  height={75}
  width={300}
>
  {({ key, index, style }) => (
    <div
      className={index % 2 ? 'ItemOdd' : 'ItemEven'}
      key={key}
      style={style}
    >
      Column {index}
    </div>
  )}
</FixedSizeList>
`;
