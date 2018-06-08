import React, { Fragment } from 'react';
import { NavLink as Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import ComponentApi from '../../components/ComponentApi';

import styles from './shared.module.css';

import CODE_CHILDREN from '../../code/FixedSizeGridChildren.js';
import CODE_ON_ITEMS_RENDERED from '../../code/FixedSizeGridOnItemsRendered.js';
import CODE_ON_SCROLL from '../../code/FixedSizeGridOnScroll.js';

export default () => (
  <ComponentApi methods={METHODS} name="FixedSizeGrid" props={PROPS} />
);

const PROPS = [
  {
    description: (
      <Fragment>
        Responsible for rendering the individual item specified by indices. This
        method receives a <code>style</code> parameter (used for positioning).
        <br />
        <br />
        If <code>useIsScrolling</code> is enabled for the list, the method also
        receives an additional <code>isScrolling</code> boolean parameter.
        <br />
        <br />
        <div className={styles.CodeBlockWrapper}>
          <CodeBlock value={CODE_CHILDREN} />
        </div>
      </Fragment>
    ),
    isRequired: true,
    name: 'children',
    type: 'function',
  },
  {
    defaultValue: '""',
    description: (
      <Fragment>
        Optional CSS class to attach to outermost <code>&lt;div&gt;</code>{' '}
        element.
      </Fragment>
    ),
    name: 'className',
    type: 'string',
  },
  {
    description: (
      <Fragment>
        Number of columns in the grid. Note that only a few columns will be
        rendered and displayed at a time.
      </Fragment>
    ),
    isRequired: true,
    name: 'columnCount',
    type: 'number',
  },
  {
    description: (
      <Fragment>Width of an individual column within the grid.</Fragment>
    ),
    isRequired: true,
    name: 'columnWidth',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        Height of the grid. This affects the number of rows that will be
        rendered (and displayed) at any given time.
      </Fragment>
    ),
    isRequired: true,
    name: 'height',
    type: 'number',
  },
  {
    defaultValue: 0,
    description: (
      <Fragment>Vertical scroll offset for initial render.</Fragment>
    ),
    name: 'initialScrollLeft',
    type: 'number',
  },
  {
    defaultValue: 0,
    description: (
      <Fragment>Horizontal scroll offset for initial render.</Fragment>
    ),
    name: 'initialScrollTop',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        Called when the items rendered by the grid change.
        <br />
        <br />
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
        Called when the grid scroll positions changes, as a result of user
        scrolling or scroll-to method calls.
        <br />
        <br />
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
        The number of items (rows and columns) to render outside of the visible
        area. This property can be important for two reasons:
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
        Note that overscanning too much can negatively impact performance. By
        default, grid overscans by one item.
      </Fragment>
    ),
    name: 'overscanCount',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        Number of rows in the grid. Note that only a few rows will be rendered
        and displayed at a time.
      </Fragment>
    ),
    isRequired: true,
    name: 'rowCount',
    type: 'number',
  },
  {
    description: (
      <Fragment>Height of an individual row within the grid.</Fragment>
    ),
    isRequired: true,
    name: 'rowHeight',
    type: 'number',
  },
  {
    defaultValue: null,
    description: (
      <Fragment>
        Optional inline style to attach to outermost <code>&lt;div&gt;</code>{' '}
        element.
      </Fragment>
    ),
    name: 'style',
    type: 'Object',
  },
  {
    defaultValue: false,
    description: (
      <Fragment>
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
      </Fragment>
    ),
    name: 'useIsScrolling',
    type: 'boolean',
  },
  {
    description: (
      <Fragment>
        Width of the grid. This affects the number of columns that will be
        rendered (and displayed) at any given time.
      </Fragment>
    ),
    isRequired: true,
    name: 'width',
    type: 'number',
  },
];

const METHODS = [
  {
    description: <Fragment>Scroll to the specified offsets.</Fragment>,
    signature: 'scrollTo({scrollLeft: number, scrollTop: number}): void',
  },
  {
    description: (
      <Fragment>
        Scroll to the specified item.
        <br />
        <br />
        By default, the Grid will scroll as little as possible to ensure the
        item is visible. You can control the alignment of the item though by
        specifying a second alignment parameter. Acceptable values are:
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
        <Link to="/examples/list/scroll-to-item">
          See here for an example of this API.
        </Link>
      </Fragment>
    ),
    signature:
      'scrollToItem({align: string = "auto", columnIndex: number, rowIndex: number }): void',
  },
];
