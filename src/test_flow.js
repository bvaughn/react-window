// @flow

import * as React from 'react';
import {
  FixedSizeList,
  VariableSizeList,
  FixedSizeGrid,
  VariableSizeGrid,
} from './';

const assertVoid = (value: void) => {};
const assertEmpty = (value: empty) => {};
const assertNumber = (value: number) => {};
const assertString = (value: string) => {};

/* FixedSizeList */

{
  const Item = ({ data }) => {
    assertNumber(data);
    // $FlowFixMe number is passed to FixedSizeList
    assertString(data);
    return null;
  };
  <FixedSizeList width={0} height={0} itemSize={0} itemCount={0} itemData={1}>
    {Item}
  </FixedSizeList>;
}

{
  const Item = ({ data }) => {
    assertVoid(data);
    // $FlowFixMe itemData is undefined by default
    assertEmpty(data);
    return null;
  };
  <FixedSizeList width={0} height={0} itemSize={0} itemCount={0}>
    {Item}
  </FixedSizeList>;
}

/* VariableSizeList */

{
  const Item = ({ data }) => {
    assertNumber(data);
    // $FlowFixMe number is passed to VariableSizeList
    assertString(data);
    return null;
  };
  <VariableSizeList
    width={0}
    height={0}
    itemSize={0}
    itemCount={0}
    itemData={1}
  >
    {Item}
  </VariableSizeList>;
}

{
  const Item = ({ data }) => {
    assertVoid(data);
    // $FlowFixMe itemData is undefined by default
    assertEmpty(data);
    return null;
  };
  <VariableSizeList width={0} height={0} itemSize={0} itemCount={0}>
    {Item}
  </VariableSizeList>;
}

/* FixedSizeGrid */

{
  const Item = ({ data }) => {
    assertNumber(data);
    // $FlowFixMe number is passed to FixedSizeGrid
    assertString(data);
    return null;
  };
  <FixedSizeGrid
    width={0}
    height={0}
    rowHeight={0}
    rowCount={0}
    columnWidth={0}
    columnCount={0}
    itemData={1}
  >
    {Item}
  </FixedSizeGrid>;
}

{
  const Item = ({ data }) => {
    assertVoid(data);
    // $FlowFixMe itemData is undefined by default
    assertEmpty(data);
    return null;
  };
  <FixedSizeGrid
    width={0}
    height={0}
    rowHeight={0}
    rowCount={0}
    columnWidth={0}
    columnCount={0}
  >
    {Item}
  </FixedSizeGrid>;
}

/* VariableSizeGrid */

{
  const Item = ({ data }) => {
    assertNumber(data);
    // $FlowFixMe number is passed to VariableSizeGrid
    assertString(data);
    return null;
  };
  <VariableSizeGrid
    width={0}
    height={0}
    rowHeight={0}
    rowCount={0}
    columnWidth={0}
    columnCount={0}
    itemData={1}
  >
    {Item}
  </VariableSizeGrid>;
}

{
  const Item = ({ data }) => {
    assertVoid(data);
    // $FlowFixMe itemData is undefined by default
    assertEmpty(data);
    return null;
  };
  <VariableSizeGrid
    width={0}
    height={0}
    rowHeight={0}
    rowCount={0}
    columnWidth={0}
    columnCount={0}
  >
    {Item}
  </VariableSizeGrid>;
}
