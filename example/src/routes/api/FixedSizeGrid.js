import React from "react";
import { NavLink as Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";

import CODE from "../../code/FixedSizeGridChildren.js";

import "./shared.css";

export default function () {
  return (
    <div className="Api">
      <div className="ApiContent">
        <h1 className="ApiHeader">
          &lt;FixedSizeGrid&gt;
        </h1>
        <h2 id="props" className="ApiSubHeader">Props</h2>
        <dl className="ApiPropList">
          <dt className="ApiPropType">
            children: function
          </dt>
          <dd className="ApiPropDefinition">
            Responsible for rendering the individual item specified by indices.
            This method also receives a <code>key</code> parameter (used by React for <a href="https://reactjs.org/docs/reconciliation.html">reconciliation</a>), and a <code>style</code> parameter (used for positioning).
            <br/><br/>
            <div className="CodeBlockWrapper">
              <CodeBlock value={CODE} />
            </div>
          </dd>
          <dt className="ApiPropType">
            className: string = ""
          </dt>
          <dd className="ApiPropDefinition">
            Optional CSS class to attach to outermost <code>&lt;div&gt;</code> element.
          </dd>
          <dt className="ApiPropType">
            columnCount: number
          </dt>
          <dd className="ApiPropDefinition">
            Number of columns in the grid.
            Note that only a few columns will be rendered and displayed at a time.
          </dd>
          <dt className="ApiPropType">
            columnWidth: number
          </dt>
          <dd className="ApiPropDefinition">
            Width of an individual column within the grid.
          </dd>
          <dt className="ApiPropType">
            height: number
          </dt>
          <dd className="ApiPropDefinition">
            Height of the grid.
            This affects the number of rows that will be rendered (and displayed) at any given time.
          </dd>
          <dt className="ApiPropType">
            overscanCount: number = 1
          </dt>
          <dd className="ApiPropDefinition">
            The number of cells (rows and columns) to render outside of the visible area.
            This property can be important for two reasons:
            <ul>
              <li>
                Overscanning by one row or column allows the tab key to focus on the next (not yet visible) cell.
              </li>
              <li>
                Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
              </li>
            </ul>
            Note that overscanning too much can negatively impact performance.
            By default, grid overscans by one cell.
          </dd>
          <dt className="ApiPropType">
            rowCount: number
          </dt>
          <dd className="ApiPropDefinition">
            Number of rows in the grid.
            Note that only a few rows will be rendered and displayed at a time.
          </dd>
          <dt className="ApiPropType">
            rowHeight: number
          </dt>
          <dd className="ApiPropDefinition">
            Height of an individual row within the grid.
          </dd>
          <dt className="ApiPropType">
            style: Object = null
          </dt>
          <dd className="ApiPropDefinition">
            Optional inline style to attach to outermost <code>&lt;div&gt;</code> element.
          </dd>
          <dt className="ApiPropType">
            useIsScrolling: boolean = false
          </dt>
          <dd className="ApiPropDefinition">
            Adds an additional <code>isScrolling</code> parameter to the <code>children</code> render function.
            This parameter can be used to show a placeholder row or column while the grid is being scrolled.
            <br/><br/>
            Note that using this parameter will result in an additional render call after scrolling has stopped (when<code>isScrolling</code> changse from true to false).
            <br/><br/>
            <Link to="/examples/list/scrolling-indicators">
              See here for an example of this API.
            </Link>
          </dd>
          <dt className="ApiPropType">
            width: number
          </dt>
          <dd className="ApiPropDefinition">
            Width of the grid.
            This affects the number of columns that will be rendered (and displayed) at any given time.
          </dd>
        </dl>
        <h2 id="methods" className="ApiSubHeader">Methods</h2>
        <dl>
          <dt className="ApiPropType">
            scrollTo({'{'} scrollLeft: number, scrollTop: number}): void
          </dt>
          <dd className="ApiPropDefinition">
            Scroll to the specified offsets.
          </dd>
          <dt className="ApiPropType">
            scrollToItem({'{'}
              align: string = "auto",
              columnIndex: number,
              rowIndex: number
            }): void
          </dt>
          <dd className="ApiPropDefinition">
            Scroll to the specified item.
            <br/><br/>
            By default, the Grid will scroll as little as possible to ensure the item is visible.
            You can control the alignment of the item though by specifying a second alignment parameter.
            Acceptable values are:
            <ul>
              <li>auto (default) - Scroll as little as possible to ensure the item is visible. (If the item is already visible, it won't scroll at all.)</li>
              <li>center - Center align the item within the grid.</li>
              <li>end - Align the item to the bottom, right hand side of the grid.</li>
              <li>start - Align the item to the top, left hand of the grid.</li>
            </ul>
            <Link to="/examples/list/scroll-to-cell">
              See here for an example of this API.
            </Link>
          </dd>
        </dl>
      </div>
    </div>
  );
}