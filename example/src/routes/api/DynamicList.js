import React from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import CodeBlock from '../../components/CodeBlock';

import CODE from '../../code/DynamicListCellSize.js';

import './shared.css';

export default function() {
  return (
    <div className="Api">
      <div className="ApiContent">
        <h1 className="ApiHeader">&lt;DynamicList&gt;</h1>
        <h2 className="ApiSubHeader">Props</h2>
        <p>
          This component has the same props as{' '}
          <Link to="/api/FixedSizeList#props">
            <code>FixedSizeList</code>
          </Link>, but with the following additions:
        </p>
        <dl className="ApiPropList">
          <dt className="ApiPropType">cellSize: (index: number) => number</dt>
          <dd className="ApiPropDefinition">
            Returns the size of a cell in the direction being windowed. For
            vertical lists, this is the row height. For horizontal lists, this
            is the column width.
            <br />
            <br />
            <div className="CodeBlockWrapper">
              <CodeBlock value={CODE} />
            </div>
          </dd>
          <dt className="ApiPropType">estimatedCellSize: number = 50</dt>
          <dd className="ApiPropDefinition">
            Estimated size of a cell in the direction being windowed. For
            vertical lists, this is the row height. For horizontal lists, this
            is the column width.
            <br />
            <br />
            This value is used to calculated the estimated total size of a list
            before its cells have all been measured. The total size impacts user
            scrolling behavior. It is updated whenever new cells are measured.
          </dd>
        </dl>
        <h2 className="ApiSubHeader">Methods</h2>
        <p>
          This component has the same methods as{' '}
          <Link to="/api/FixedSizeList#methods">
            <code>FixedSizeList</code>
          </Link>, but with the following additions:
        </p>
        <dl>
          <dt className="ApiPropType">resetAfterIndex(index: number): void</dt>
          <dd className="ApiPropDefinition">
            <code>DynamicList</code> caches offsets and measurements for each
            index for performance purposes. This method clears that cached data
            for all cells after (and including) the specified index. It should
            be called whenever a cell's size changes. (Note that this is not a
            typical occurrance.)
          </dd>
        </dl>
      </div>
    </div>
  );
}
