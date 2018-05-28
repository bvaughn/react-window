import React, { Fragment } from 'react';
import { NavLink as Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import ComponentApi from '../../components/ComponentApi';

import styles from './shared.module.css';

import CODE_CHILDREN from '../../code/FixedSizeListChildren.js';
import CODE_ON_ITEMS_RENDERED from '../../code/FixedSizeListOnItemsRendered.js';
import CODE_ON_SCROLL from '../../code/FixedSizeListOnScroll.js';

export default () => (
  <ComponentApi methods={METHODS} name="FixedSizeList" props={PROPS} />
);

const PROPS = [
  {
    description: (
      <Fragment>
        Size of a cell in the direction being windowed. For vertical lists, this
        is the row height. For horizontal lists, this is the column width.
      </Fragment>
    ),
    isRequired: true,
    name: 'cellSize',
    type: 'number',
  },
  {
    description: (
      <Fragment>
        Responsible for rendering the individual item specified by an{' '}
        <code>index</code> parameter. This method also receives a{' '}
        <code>key</code> parameter (used by React for{' '}
        <a href="https://reactjs.org/docs/reconciliation.html">
          reconciliation
        </a>), and a <code>style</code> parameter (used for positioning).
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
        Total number of items in the list. Note that only a few items will be
        rendered and displayed at a time.
      </Fragment>
    ),
    isRequired: true,
    name: 'count',
    type: 'number',
  },
  {
    defaultValue: '"vertical"',
    description: (
      <Fragment>
        Primary scroll direction of the list. Acceptable values are:
        <ul>
          <li>vertical (default) - Up/down scrolling.</li>
          <li>horizontal - Left/right scrolling.</li>
        </ul>
        Note that lists may scroll in both directions (depending on CSS) but
        content will only be windowed in the primary direction.
      </Fragment>
    ),
    name: 'direction',
    type: 'string',
  },
  {
    description: (
      <Fragment>
        Height of the list.
        <br />
        <br />
        For vertical lists, this must be a number. It affects the number of rows
        that will be rendered (and displayed) at any given time.
        <br />
        <br />
        For horizontal lists, this can be a number or a string (e.g. "50%").
      </Fragment>
    ),
    isRequired: true,
    name: 'height',
    type: 'number | string',
  },
  {
    description: (
      <Fragment>
        Called when the items rendered by the list change.
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
        Called when the list scroll positions changes, as a result of user
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
        The number of cells (rows or columns) to render outside of the visible
        area. This property can be important for two reasons:
        <ul>
          <li>
            Overscanning by one row or column allows the tab key to focus on the
            next (not yet visible) cell.
          </li>
          <li>
            Overscanning slightly can reduce or prevent a flash of empty space
            when a user first starts scrolling.
          </li>
        </ul>
        Note that overscanning too much can negatively impact performance. By
        default, List overscans by one cell.
      </Fragment>
    ),
    name: 'overscanCount',
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
        show a placeholder row or column while the list is being scrolled.
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
        Width of the list.
        <br />
        <br />
        For horizontal lists, this must be a number. It affects the number of
        columns that will be rendered (and displayed) at any given time.
        <br />
        <br />
        For vertical lists, this can be a number or a string (e.g. "50%").
      </Fragment>
    ),
    isRequired: true,
    name: 'width',
    type: 'number | string',
  },
];

const METHODS = [
  {
    description: (
      <Fragment>
        Scroll to the specified offset (<code>scrollTop</code> or{' '}
        <code>scrollLeft</code>, depending on the <code>direction</code> prop).
      </Fragment>
    ),
    signature: 'scrollTo(scrollOffset: number): void',
  },
  {
    description: (
      <Fragment>
        Scroll to the specified item.
        <br />
        <br />
        By default, the List will scroll as little as possible to ensure the
        item is visible. You can control the alignment of the item though by
        specifying a second alignment parameter. Acceptable values are:
        <ul>
          <li>
            auto (default) - Scroll as little as possible to ensure the item is
            visible. (If the item is already visible, it won't scroll at all.)
          </li>
          <li>center - Center align the item within the list.</li>
          <li>
            end - Align the item to the end of the list (the bottom for vertical
            lists or the right for horizontal lists).
          </li>
          <li>
            start - Align the item to the beginning of the list (the top for
            vertical lists or the left for horizontal lists).
          </li>
        </ul>
        <Link to="/examples/list/scroll-to-cell">
          See here for an example of this API.
        </Link>
      </Fragment>
    ),
    signature: 'scrollToItem(index: number, align: string = "auto"): void',
  },
];
