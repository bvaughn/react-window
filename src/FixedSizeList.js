// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const FixedSizeList = createListComponent({
  getCellOffset: ({ cellSize, size }: Props, index: number): number =>
    index * ((cellSize: any): number),

  getCellSize: ({ cellSize, size }: Props, index: number): number =>
    ((cellSize: any): number),

  getEstimatedTotalSize: ({ cellSize, count }: Props) =>
    ((cellSize: any): number) * count,

  getOffsetForIndexAndAlignment: (
    { cellSize, count, direction, height, width }: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    const size = (((direction === 'horizontal' ? width : height): any): number);
    const maxOffset = Math.min(
      count * ((cellSize: any): number) - size,
      index * ((cellSize: any): number)
    );
    const minOffset = Math.max(
      0,
      index * ((cellSize: any): number) - size + ((cellSize: any): number)
    );

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: (
    { cellSize, count }: Props,
    offset: number
  ): number =>
    Math.max(
      0,
      Math.min(count - 1, Math.floor(offset / ((cellSize: any): number)))
    ),

  getStopIndexForStartIndex: (
    { cellSize, count, direction, height, width }: Props,
    startIndex: number,
    scrollOffset: number
  ): number => {
    const offset = startIndex * ((cellSize: any): number);
    const size = (((direction === 'horizontal' ? width : height): any): number);
    return Math.max(
      0,
      Math.min(
        count - 1,
        startIndex +
          Math.floor(
            (size + (scrollOffset - offset)) / ((cellSize: any): number)
          )
      )
    );
  },

  initInstanceProps(props: Props): any {
    // Noop
  },

  validateProps: ({ cellSize }: Props): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof cellSize !== 'number') {
        throw Error(
          'An invalid "cellSize" prop has been specified. ' +
            'Value should be a number. ' +
            `"${cellSize === null ? 'null' : typeof cellSize}" was specified.`
        );
      }
    }
  },
});

export default FixedSizeList;
