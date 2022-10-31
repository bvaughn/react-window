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
        </Link>
        , but with the following additions:
      </p>
    }
    name="VariableSizeGrid"
    props={PROPS}
    propsIntro={
      <p>
        This component has the same props as{' '}
        <Link to="/api/FixedSizeGrid#props">
          <code>FixedSizeGrid</code>
        </Link>
        , but with the following additions:
      </p>
    }
  />
);

const PROPS = [
  {
    description: (
      <Fragment>
        <p>Returns the width of the specified column.</p>
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
        <p>Average (or estimated) column width for unrendered columns.</p>
        <p>
          This value is used to calculated the estimated total width of a Grid
          before its columns have all been measured. The estimated width impacts
          user scrolling behavior. It is updated whenever new columns are
          measured.
        </p>
      </Fragment>
    ),
    name: 'estimatedColumnWidth',
    type: 'number',
  },
  {
    defaultValue: 50,
    description: (
      <Fragment>
        <p>Average (or estimated) row height for unrendered rows.</p>
        <p>
          This value is used to calculated the estimated total height of a Grid
          before its rows have all been measured. The estimated height impacts
          user scrolling behavior. It is updated whenever new rows are measured.
        </p>
      </Fragment>
    ),
    name: 'estimatedRowHeight',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        <p>Returns the height of the specified row.</p>
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
        <p>
          <code>VariableSizeGrid</code> caches offsets and measurements for each
          column index for performance purposes. This method clears that cached
          data for all columns after (and including) the specified index. It
          should be called whenever a column's width changes. (Note that this is
          not a typical occurrance.)
        </p>
        <p>
          By default the grid will automatically re-render after the index is
          reset. If you would like to delay this re-render until e.g. a state
          update has completed in the parent component, specify a value of
          <code>false</code> for the second, optional parameter.
        </p>
      </Fragment>
    ),
    signature:
      'resetAfterColumnIndex(index: number, shouldForceUpdate: boolean = true): void',
  },
  {
    description: (
      <Fragment>
        <p>
          <code>VariableSizeGrid</code> caches offsets and measurements for each
          item for performance purposes. This method clears that cached data for
          all items after (and including) the specified indices. It should be
          called whenever an items size changes. (Note that this is not a
          typical occurrance.)
        </p>
        <p>
          By default the grid will automatically re-render after the index is
          reset. If you would like to delay this re-render until e.g. a state
          update has completed in the parent component, specify a value of
          <code>false</code> for the optional <code>shouldForceUpdate</code>{' '}
          parameter.
        </p>
      </Fragment>
    ),
    signature:
      'resetAfterIndices({ columnIndex: number, rowIndex: number, shouldForceUpdate: boolean = true }): void',
  },
  {
    description: (
      <Fragment>
        <p>
          <code>VariableSizeGrid</code> caches offsets and measurements for each
          row index for performance purposes. This method clears that cached
          data for all rows after (and including) the specified index. It should
          be called whenever a row's height changes. (Note that this is not a
          typical occurrance.)
        </p>
        <p>
          By default the grid will automatically re-render after the index is
          reset. If you would like to delay this re-render until e.g. a state
          update has completed in the parent component, specify a value of
          <code>false</code> for the second, optional parameter.
        </p>
      </Fragment>
    ),
    signature:
      'resetAfterRowIndex(index: number, shouldForceUpdate: boolean = true): void',
  },
];
