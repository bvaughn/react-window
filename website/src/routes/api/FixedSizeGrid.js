import React, { Fragment } from 'react';
import { NavLink as Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import ComponentApi from '../../components/ComponentApi';

import styles from './shared.module.css';

import CODE_CHILDREN_CLASS from '../../code/FixedSizeGridChildrenClass.js';
import CODE_CHILDREN_FUNCTION from '../../code/FixedSizeGridChildrenFunction.js';
import CODE_ON_ITEMS_RENDERED from '../../code/FixedSizeGridOnItemsRendered.js';
import CODE_ON_SCROLL from '../../code/FixedSizeGridOnScroll.js';

export default () => (
  <ComponentApi methods={METHODS} name="FixedSizeGrid" props={PROPS} />
);

const PROPS = [
  {
    description: (
      <Fragment>
        <p>
          React component responsible for rendering the individual item
          specified by indices. This component receives a <code>style</code>{' '}
          prop (used for positioning).
        </p>
        <p>
          If <code>useIsScrolling</code> is enabled for the list, the component
          also receives an additional <code>isScrolling</code> boolean prop.
        </p>
        <p>Function components are useful for rendering simple items:</p>
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_CHILDREN_FUNCTION} />
        </div>
        <p>
          To render more complex items, you may wish to extend{' '}
          <code>PureComponent</code> to avoid unnecessary re-renders:
        </p>
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_CHILDREN_CLASS} />
        </div>
      </Fragment>
    ),
    isRequired: true,
    name: 'children',
    type: 'component',
  },
  {
    defaultValue: '""',
    description: (
      <p>
        Optional CSS class to attach to outermost <code>&lt;div&gt;</code>{' '}
        element.
      </p>
    ),
    name: 'className',
    type: 'string',
  },
  {
    description: (
      <p>
        Number of columns in the grid. Note that only a few columns will be
        rendered and displayed at a time.
      </p>
    ),
    isRequired: true,
    name: 'columnCount',
    type: 'number',
  },
  {
    description: <p>Width of an individual column within the grid.</p>,
    isRequired: true,
    name: 'columnWidth',
    type: 'number',
  },
  {
    description: (
      <p>
        Height of the grid. This affects the number of rows that will be
        rendered (and displayed) at any given time.
      </p>
    ),
    isRequired: true,
    name: 'height',
    type: 'number',
  },
  {
    defaultValue: 0,
    description: <p>Vertical scroll offset for initial render.</p>,
    name: 'initialScrollLeft',
    type: 'number',
  },
  {
    defaultValue: 0,
    description: <p>Horizontal scroll offset for initial render.</p>,
    name: 'initialScrollTop',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        <p>Called when the items rendered by the grid change.</p>
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_ON_ITEMS_RENDERED} />
        </div>
      </Fragment>
    ),
    name: 'onItemsRendered',
    type: 'function',
  },
  {
    description: (
      <Fragment>
        <p>
          Called when the grid scroll positions changes, as a result of user
          scrolling or scroll-to method calls.
        </p>
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_ON_SCROLL} />
        </div>
      </Fragment>
    ),
    name: 'onScroll',
    type: 'function',
  },
  {
    defaultValue: 1,
    description: (
      <Fragment>
        <p>
          The number of items (rows and columns) to render outside of the
          visible area. This property can be important for two reasons:
        </p>
        <ul>
          <li>
            Overscanning by one row or column allows the tab key to focus on the
            next (not yet visible) item.
          </li>
          <li>
            Overscanning slightly can reduce or prevent a flash of empty space
            when a user first starts scrolling.
          </li>
        </ul>
        <p>
          Note that overscanning too much can negatively impact performance. By
          default, grid overscans by one item.
        </p>
      </Fragment>
    ),
    name: 'overscanCount',
    type: 'number',
  },
  {
    description: (
      <p>
        Number of rows in the grid. Note that only a few rows will be rendered
        and displayed at a time.
      </p>
    ),
    isRequired: true,
    name: 'rowCount',
    type: 'number',
  },
  {
    description: <p>Height of an individual row within the grid.</p>,
    isRequired: true,
    name: 'rowHeight',
    type: 'number',
  },
  {
    defaultValue: null,
    description: (
      <p>
        Optional inline style to attach to outermost <code>&lt;div&gt;</code>{' '}
        element.
      </p>
    ),
    name: 'style',
    type: 'Object',
  },
  {
    defaultValue: false,
    description: (
      <p>
        Adds an additional <code>isScrolling</code> parameter to the{' '}
        <code>children</code> render function. This parameter can be used to
        show a placeholder row or column while the grid is being scrolled.
        <br />
        <br />
        Note that using this parameter will result in an additional render call
        after scrolling has stopped (when<code>isScrolling</code> changse from
        true to false).
        <br />
        <br />
        <Link to="/examples/list/scrolling-indicators">
          See here for an example of this API.
        </Link>
      </p>
    ),
    name: 'useIsScrolling',
    type: 'boolean',
  },
  {
    description: (
      <p>
        Width of the grid. This affects the number of columns that will be
        rendered (and displayed) at any given time.
      </p>
    ),
    isRequired: true,
    name: 'width',
    type: 'number',
  },
];

const METHODS = [
  {
    description: <p>Scroll to the specified offsets.</p>,
    signature: 'scrollTo({scrollLeft: number, scrollTop: number}): void',
  },
  {
    description: (
      <Fragment>
        <p>Scroll to the specified item.</p>
        <p>
          By default, the Grid will scroll as little as possible to ensure the
          item is visible. You can control the alignment of the item though by
          specifying a second alignment parameter. Acceptable values are:
        </p>
        <ul>
          <li>
            auto (default) - Scroll as little as possible to ensure the item is
            visible. (If the item is already visible, it won't scroll at all.)
          </li>
          <li>center - Center align the item within the grid.</li>
          <li>
            end - Align the item to the bottom, right hand side of the grid.
          </li>
          <li>start - Align the item to the top, left hand of the grid.</li>
        </ul>
        <p>
          <Link to="/examples/list/scroll-to-item">
            See here for an example of this API.
          </Link>
        </p>
      </Fragment>
    ),
    signature:
      'scrollToItem({align: string = "auto", columnIndex: number, rowIndex: number }): void',
  },
];
