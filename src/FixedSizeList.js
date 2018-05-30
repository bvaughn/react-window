// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const FixedSizeList = createListComponent({
  getCellOffset: ({ itemSize, size }: Props, index: number): number =>
    index * ((itemSize: any): number),

  getItemSize: ({ itemSize, size }: Props, index: number): number =>
    ((itemSize: any): number),

  getEstimatedTotalSize: ({ count, itemSize }: Props) =>
    ((itemSize: any): number) * count,

  getOffsetForIndexAndAlignment: (
    { count, direction, height, itemSize, width }: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    const size = (((direction === 'horizontal' ? width : height): any): number);
    const maxOffset = Math.min(
      count * ((itemSize: any): number) - size,
      index * ((itemSize: any): number)
    );
    const minOffset = Math.max(
      0,
      index * ((itemSize: any): number) - size + ((itemSize: any): number)
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
    { itemSize, count }: Props,
    offset: number
  ): number =>
    Math.max(
      0,
      Math.min(count - 1, Math.floor(offset / ((itemSize: any): number)))
    ),

  getStopIndexForStartIndex: (
    { count, direction, height, itemSize, width }: Props,
    startIndex: number,
    scrollOffset: number
  ): number => {
    const offset = startIndex * ((itemSize: any): number);
    const size = (((direction === 'horizontal' ? width : height): any): number);
    return Math.max(
      0,
      Math.min(
        count - 1,
        startIndex +
          Math.floor(
            (size + (scrollOffset - offset)) / ((itemSize: any): number)
          )
      )
    );
  },

  initInstanceProps(props: Props): any {
    // Noop
  },

  validateProps: ({ itemSize }: Props): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof itemSize !== 'number') {
        throw Error(
          'An invalid "itemSize" prop has been specified. ' +
            'Value should be a number. ' +
            `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`
        );
      }
    }
  },
});

export default FixedSizeList;
