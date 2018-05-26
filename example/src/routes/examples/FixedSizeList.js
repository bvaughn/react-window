import React from 'react';
import { FixedSizeList } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE_HORIZONTAL from '../../code/FixedSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/FixedSizeListVertical.js';

import './shared.css';

export default function() {
  return (
    <div className="ExampleWrapper">
      <h1 className="ExampleHeader">Basic List</h1>
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

          <CodeSandboxLink className="TryItOutLink" id="vjo8w37qw0" />
        </div>
        <div className="ExampleCode">
          <CodeBlock value={CODE_VERTICAL} />
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

          <CodeSandboxLink className="TryItOutLink" id="n4wwlyn8rm" />
        </div>
        <div className="ExampleCode">
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
