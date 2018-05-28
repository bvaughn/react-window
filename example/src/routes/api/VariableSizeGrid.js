import React, { Fragment } from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import CodeBlock from '../../components/CodeBlock';
import ComponentApi from '../../components/ComponentApi';

import styles from './shared.module.css';

import CODE_COLUMN_WIDTH from '../../code/VariableSizeGridColumnWidth.js';
import CODE_ROW_HEIGHT from '../../code/VariableSizeGridRowHeight.js';

export default () => (
  <ComponentApi
    methods={METHODS}
    methodsIntro={
      <p>
        This component has the same methods as{' '}
        <Link to="/api/FixedSizeGrid#methods">
          <code>FixedSizeGrid</code>
        </Link>, but with the following additions:
      </p>
    }
    name="VariableSizeGrid"
    props={PROPS}
    propsIntro={
      <p>
        This component has the same props as{' '}
        <Link to="/api/FixedSizeGrid#props">
          <code>FixedSizeGrid</code>
        </Link>, but with the following additions:
      </p>
    }
  />
);

const PROPS = [
  {
    description: (
      <Fragment>
        Returns the width of the specified column.
        <br />
        <br />
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_COLUMN_WIDTH} />
        </div>
      </Fragment>
    ),
    isRequired: true,
    name: 'columnWidth',
    type: '(index: number) => number',
  },
  {
    defaultValue: 50,
    description: (
      <Fragment>
        Average (or estimated) column width for unrendered columns.
        <br />
        <br />
        This value is used to calculated the estimated total width of a Grid
        before its columns have all been measured. The estimated width impacts
        user scrolling behavior. It is updated whenever new columns are
        measured.
      </Fragment>
    ),
    name: 'estimatedColumnWidth',
    type: 'number',
  },
  {
    defaultValue: 50,
    description: (
      <Fragment>
        Average (or estimated) row height for unrendered rows.
        <br />
        <br />
        This value is used to calculated the estimated total height of a Grid
        before its rows have all been measured. The estimated height impacts
        user scrolling behavior. It is updated whenever new columns are
        measured.
      </Fragment>
    ),
    name: 'estimatedRowHeight',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        Returns the height of the specified row.
        <br />
        <br />
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_ROW_HEIGHT} />
        </div>
      </Fragment>
    ),
    isRequired: true,
    name: 'rowHeight',
    type: '(index: number) => number',
  },
];

const METHODS = [
  {
    description: (
      <Fragment>
        <code>VariableSizeGrid</code> caches offsets and measurements for each column
        index for performance purposes. This method clears that cached data for
        all columns after (and including) the specified index. It should be
        called whenever a column's width changes. (Note that this is not a
        typical occurrance.)
      </Fragment>
    ),
    signature: 'resetAfterColumnIndex(index: number): void',
  },
  {
    description: (
      <Fragment>
        <code>VariableSizeGrid</code> caches offsets and measurements for each row
        index for performance purposes. This method clears that cached data for
        all rows after (and including) the specified index. It should be called
        whenever a row's height changes. (Note that this is not a typical
        occurrance.)
      </Fragment>
    ),
    signature: 'resetAfterRowIndex(index: number): void',
  },
];
