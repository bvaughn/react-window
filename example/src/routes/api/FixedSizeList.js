import React from "react";
import { NavLink as Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";

import CODE from "../../code/FixedSizeListChildren.js";

import "./shared.css";

export default function () {
  return (
    <div className="Api">
      <div className="ApiContent">
        <h1 className="ApiHeader">
          &lt;FixedSizeList&gt;
        </h1>
        <h2 className="ApiSubHeader">Props</h2>
        <dl className="ApiPropList">
          <dt className="ApiPropType">
            cellSize: number
          </dt>
          <dd className="ApiPropDefinition">
            Size of a cell in the direction being windowed.
            For vertical lists, this is the row height.
            For horizontal lists, this is the column width.
          </dd>
          <dt className="ApiPropType">
            children: function
          </dt>
          <dd className="ApiPropDefinition">
            Responsible for rendering the individual item specified by an <code>index</code> parameter.
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
            count: number
          </dt>
          <dd className="ApiPropDefinition">
            Total number of items in the list.
            Note that only a few items will be rendered and displayed at a time.
          </dd>
          <dt className="ApiPropType">
            direction: string = "vertical"
          </dt>
          <dd className="ApiPropDefinition">
            Primary scroll direction of the list.
            Acceptable values are:
            <ul>
              <li>vertical (default) - Up/down scrolling.</li>
              <li>horizontal - Left/right scrolling.</li>
            </ul>
            Note that lists may scroll in both directions (depending on CSS) but content will only be windowed in the primary direction.
          </dd>
          <dt className="ApiPropType">
            height: number | string
          </dt>
          <dd className="ApiPropDefinition">
            Height of the list.
            <br/><br/>
            For vertical lists, this must be a number.
            It affects the number of rows that will be rendered (and displayed) at any given time.
            <br/><br/>
            For horizontal lists, this can be a number or a string (e.g. "50%").
          </dd>
          <dt className="ApiPropType">
            overscanCount: number = 1
          </dt>
          <dd className="ApiPropDefinition">
            The number of cells (rows or columns) to render outside of the visible area.
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
            By default, List overscans by one cell.
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
            This parameter can be used to show a placeholder row or column while the list is being scrolled.
            <br/><br/>
            Note that using this parameter will result in an additional render call after scrolling has stopped (when<code>isScrolling</code> changse from true to false).
            <br/><br/>
            <Link to="/examples/list/scrolling-indicators">
              See here for an example of this API.
            </Link>
          </dd>
          <dt className="ApiPropType">
            width: number | string
          </dt>
          <dd className="ApiPropDefinition">
            Width of the list.
            <br/><br/>
            For horizontal lists, this must be a number.
            It affects the number of columns that will be rendered (and displayed) at any given time.
            <br/><br/>
            For vertical lists, this can be a number or a string (e.g. "50%").
          </dd>
        </dl>
        <h2 className="ApiSubHeader">Methods</h2>
        <dl>
          <dt className="ApiPropType">
            scrollToItem(index: number, align: string = "auto"): void
          </dt>
          <dd className="ApiPropDefinition">
            Scroll to the specified item.
            <br/><br/>
            By default, the List will scroll as little as possible to ensure the item is visible.
            You can control the alignment of the item though by specifying a second alignment parameter.
            Acceptable values are:
            <ul>
              <li>auto (default) - Scroll as little as possible to ensure the item is visible. (If the item is already visible, it won't scroll at all.)</li>
              <li>center - Center align the item within the list.</li>
              <li>end - Align the item to the end of the list (the bottom for vertical lists or the right for horizontal lists).</li>
              <li>start - Align the item to the beginning of the list (the top for vertical lists or the left for horizontal lists).</li>
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
