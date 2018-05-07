// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const DEFAULT_ESTIMATED_VERTICAL_CELL_SIZE = 20;
const DEFAULT_ESTIMATED_HORIZONTAL_CELL_SIZE = 100;

const DynamicList = createListComponent({
  getCellSize: ({ cellSize, size }: Props, index: number): number =>
    cellSize(index),
  getEstimatedTotalSize: ({ cellSize, count }: Props) => {
    // TODO
    console.log('getEstimatedTotalSize()', this)
    return 10000;
  },
  getOffsetForIndex: (
    { cellSize, direction, height, width }: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    // TODO
    return index * 25;
  },
  getStartIndexForOffset: (
    { cellSize, count }: Props,
    offset: number
  ): number => {
    // TODO
    return 0;
  },
  getStopIndexForStartIndex: (
    { cellSize, count, direction, height, width }: Props,
    startIndex: number
  ): number => {
    // TODO
    return 10;
  },
  validateProps: ({ cellSize }: Props): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof cellSize !== 'function') {
        throw Error(
          'An invalid "cellSize" prop has been specified. ' +
            'Value should be a function. ' +
            `"${cellSize === null ? 'null' : typeof cellSize}" was specified.`
        );
      }
    }
  },
});

export default DynamicList;
