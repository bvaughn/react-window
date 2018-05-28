import React, { Fragment } from 'react';
import { NavHashLink as Link } from 'react-router-hash-link';
import CodeBlock from '../../components/CodeBlock';
import ComponentApi from '../../components/ComponentApi';

import styles from './shared.module.css';

import CODE from '../../code/VariableSizeListCellSize.js';

export default () => (
  <ComponentApi
    methods={METHODS}
    methodsIntro={
      <p>
        This component has the same methods as{' '}
        <Link to="/api/FixedSizeList#methods">
          <code>FixedSizeList</code>
        </Link>, but with the following additions:
      </p>
    }
    name="VariableSizeList"
    props={PROPS}
    propsIntro={
      <p>
        This component has the same props as{' '}
        <Link to="/api/FixedSizeList#props">
          <code>FixedSizeList</code>
        </Link>, but with the following additions:
      </p>
    }
  />
);

const PROPS = [
  {
    description: (
      <Fragment>
        Returns the size of a cell in the direction being windowed. For vertical
        lists, this is the row height. For horizontal lists, this is the column
        width.
        <br />
        <br />
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE} />
        </div>
      </Fragment>
    ),
    isRequired: true,
    name: 'cellSize',
    type: '(index: number) => number',
  },
  {
    defaultValue: 50,
    description: (
      <Fragment>
        Estimated size of a cell in the direction being windowed. For vertical
        lists, this is the row height. For horizontal lists, this is the column
        width.
        <br />
        <br />
        This value is used to calculated the estimated total size of a list
        before its cells have all been measured. The total size impacts user
        scrolling behavior. It is updated whenever new cells are measured.
      </Fragment>
    ),
    isRequired: true,
    name: 'estimatedCellSize',
    type: 'number',
  },
];

const METHODS = [
  {
    description: (
      <Fragment>
        <code>VariableSizeList</code> caches offsets and measurements for each
        index for performance purposes. This method clears that cached data for
        all cells after (and including) the specified index. It should be called
        whenever a cell's size changes. (Note that this is not a typical
        occurrance.)
      </Fragment>
    ),
    signature: 'resetAfterIndex(index: number): void',
  },
];
