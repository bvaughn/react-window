import React from "react";

import "./shared.css";

export default function () {
  return (
    <div className="Api">
      <div className="ApiContent">
        <h1 className="ApiHeader">
          &lt;FixedSizeList&gt;
        </h1>
        <dl className="ApiPropList">
          <dt className="ApiPropType">
            cellSize: number
          </dt>
          <dd className="ApiPropDefinition">
            Size of a cell in the direction being windowed.
            <br/><br/>
            For vertical lists of rows, this is the row height.
            For horizontal lists of columns, this is the column width.
          </dd>
          <dt className="ApiPropType">
            children: function
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            className?: string
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            count: number
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            direction: string
          </dt>
          <dd className="ApiPropDefinition">
            Primary scroll direction of the list. Acceptable values are:
            <ul>
              <li>vertical (default) - Up/down scrolling.</li>
              <li>horizontal - Left/right scrolling.</li>
            </ul>
            Note that lists may scroll in both directions (depending on CSS) but content will only be windowed in the primary direction.
          </dd>
          <dt className="ApiPropType">
            height: number
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            overscanCount: number
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            style?: Object
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            useIsScrolling: boolean
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
          <dt className="ApiPropType">
            width: number
          </dt>
          <dd className="ApiPropDefinition">
          </dd>
        </dl>
      </div>
    </div>
  );
}