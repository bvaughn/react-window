import React from 'react';
import { FixedSizeList } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE from '../../code/ScrollingIndicatorList.js';

import './shared.css';

export default function() {
  return (
    <div className="ExampleWrapper">
      <h1 className="ExampleHeader">Scrolling indicators</h1>
      <div className="Example">
        <div className="ExampleDemo">
          <FixedSizeList
            cellSize={35}
            className="List"
            count={1000}
            height={150}
            useIsScrolling
            width={300}
          >
            {({ key, index, isScrolling, style }) => (
              <div
                className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                key={key}
                style={style}
              >
                {isScrolling ? 'Scrolling' : `Row ${index}`}
              </div>
            )}
          </FixedSizeList>

          <CodeSandboxLink className="TryItOutLink" id="3qw073y3x6" />
        </div>
        <div className="ExampleCode">
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
