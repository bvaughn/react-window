// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const DEFAULT_ESTIMATED_VERTICAL_CELL_SIZE = 20;
const DEFAULT_ESTIMATED_HORIZONTAL_CELL_SIZE = 100;

type DynanmicProps = {|
  estimatedCellSize: number,
  ...Props
|};

const DynamicList = createListComponent({
  getCellOffset: (props: Props, index: number): number => {
    const { estimatedCellSize } = ((props: any): DynanmicProps);
    // TODO Use cache
    return index * estimatedCellSize;
  },
  getCellSize: ({ cellSize, size }: Props, index: number): number =>
    ((cellSize: any): Function)(index),
  getEstimatedTotalSize: (props: Props) => {
    const { estimatedCellSize, count } = ((props: any): DynanmicProps);
    // TODO Keep a rolling estimate
    return count * estimatedCellSize;
  },
  getOffsetForIndexAndAlignment: (
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

DynamicList.defaultProps = {
  estimatedCellSize: 25,
  ...DynamicList.defaultProps
};

export default DynamicList;
