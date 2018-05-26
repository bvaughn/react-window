import React from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import CodeBlock from '../../components/CodeBlock';

import CODE_COLUMN_WIDTH from '../../code/DynamicGridColumnWidth.js';
import CODE_ROW_HEIGHT from '../../code/DynamicGridRowHeight.js';

import './shared.css';

export default function() {
  return (
    <div className="Api">
      <div className="ApiContent">
        <h1 className="ApiHeader">&lt;DynamicGrid&gt;</h1>
        <h2 className="ApiSubHeader">Props</h2>
        <p>
          This component has the same props as{' '}
          <Link to="/api/FixedSizeGrid#props">
            <code>FixedSizeGrid</code>
          </Link>, but with the following additions:
        </p>
        <dl className="ApiPropGrid">
          <dt className="ApiPropType">
            columnWidth: (index: number) => number
          </dt>
          <dd className="ApiPropDefinition">
            Returns the width of the specified column.
            <br />
            <br />
            <div className="CodeBlockWrapper">
              <CodeBlock value={CODE_COLUMN_WIDTH} />
            </div>
          </dd>
          <dt className="ApiPropType">estimatedColumnWidth: number = 50</dt>
          <dd className="ApiPropDefinition">
            Average (or estimated) column width for unrendered columns.
            <br />
            <br />
            This value is used to calculated the estimated total width of a Grid
            before its columns have all been measured. The estimated width
            impacts user scrolling behavior. It is updated whenever new columns
            are measured.
          </dd>
          <dt className="ApiPropType">estimatedRowHeight: number = 50</dt>
          <dd className="ApiPropDefinition">
            Average (or estimated) row height for unrendered rows.
            <br />
            <br />
            This value is used to calculated the estimated total height of a
            Grid before its rows have all been measured. The estimated height
            impacts user scrolling behavior. It is updated whenever new columns
            are measured.
          </dd>
          <dt className="ApiPropType">rowHeight: (index: number) => number</dt>
          <dd className="ApiPropDefinition">
            Returns the height of the specified row.
            <br />
            <br />
            <div className="CodeBlockWrapper">
              <CodeBlock value={CODE_ROW_HEIGHT} />
            </div>
          </dd>
        </dl>
        <h2 className="ApiSubHeader">Methods</h2>
        <p>
          This component has the same methods as{' '}
          <Link to="/api/FixedSizeGrid#methods">
            <code>FixedSizeGrid</code>
          </Link>, but with the following additions:
        </p>
        <dl>
          <dt className="ApiPropType">
            resetAfterColumnIndex(index: number): void
          </dt>
          <dd className="ApiPropDefinition">
            <code>DynamicGrid</code> caches offsets and measurements for each
            column index for performance purposes. This method clears that
            cached data for all columns after (and including) the specified
            index. It should be called whenever a column's width changes. (Note
            that this is not a typical occurrance.)
          </dd>
        </dl>
        <dl>
          <dt className="ApiPropType">
            resetAfterRowIndex(index: number): void
          </dt>
          <dd className="ApiPropDefinition">
            <code>DynamicGrid</code> caches offsets and measurements for each
            row index for performance purposes. This method clears that cached
            data for all rows after (and including) the specified index. It
            should be called whenever a row's height changes. (Note that this is
            not a typical occurrance.)
          </dd>
        </dl>
      </div>
    </div>
  );
}
