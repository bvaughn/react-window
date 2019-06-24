// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const FixedSizeList = createListComponent({
  getItemOffset: ({ itemSize }: Props<any>, index: number): number =>
    index * ((itemSize: any): number),

  getItemSize: ({ itemSize }: Props<any>, index: number): number =>
    ((itemSize: any): number),

  getEstimatedTotalSize: ({ itemCount, itemSize }: Props<any>) =>
    ((itemSize: any): number) * itemCount,

  getOffsetForIndexAndAlignment: (
    { direction, height, itemCount, itemSize, layout, width }: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    // TODO Deprecate direction "horizontal"
    const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
    const size = (((isHorizontal ? width : height): any): number);
    const lastViewportOffset = Math.max(
      0,
      itemCount * ((itemSize: any): number) - size
    );
    const maxOffset = Math.min(
      lastViewportOffset,
      index * ((itemSize: any): number)
    );
    const minOffset = Math.max(
      0,
      index * ((itemSize: any): number) - size + ((itemSize: any): number)
    );

    if (align === 'smart') {
      if (
        scrollOffset >= minOffset - size &&
        scrollOffset <= maxOffset + size
      ) {
        align = 'auto';
      } else {
        align = 'center';
      }
    }

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center': {
        // "Centered" offset is usually the average of the min and max
        // offsets. But near the beginning or end of the list, this math
        // doesn't produce the actual closest-to-center offset, so we
        // override.
        const centered = Math.round(minOffset + (maxOffset - minOffset) / 2);
        if (centered < Math.ceil(size / 2)) {
          return 0; // near the beginning
        } else if (centered > lastViewportOffset + Math.floor(size / 2)) {
          return lastViewportOffset; // near the end
        } else {
          return centered;
        }
      }
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          // For auto alignment, if size isn't an even multiple of itemSize,
          // always put the partial item at the end of the viewport because it
          // looks better than at the beginning. Exception: don't do this if the
          // viewport is already scrolled to the end.
          const remainder = size % ((itemSize: any): number);
          if (minOffset + remainder < lastViewportOffset) {
            return minOffset + remainder;
          } else {
            return minOffset;
          }
        } else {
          return maxOffset;
        }
    }
  },

  getStartIndexForOffset: (
    { itemCount, itemSize }: Props<any>,
    offset: number
  ): number =>
    Math.max(
      0,
      Math.min(itemCount - 1, Math.floor(offset / ((itemSize: any): number)))
    ),

  getStopIndexForStartIndex: (
    { direction, height, itemCount, itemSize, layout, width }: Props<any>,
    startIndex: number,
    scrollOffset: number
  ): number => {
    // TODO Deprecate direction "horizontal"
    const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
    const offset = startIndex * ((itemSize: any): number);
    const size = (((isHorizontal ? width : height): any): number);
    // How far before the scrollOffset does the first visible item start?
    // Will be zero if scrollOffset is an item boundary.
    const startingPartialSize = scrollOffset - offset;
    const visibleItems = Math.ceil(
      (size + startingPartialSize) / ((itemSize: any): number)
    );
    return Math.max(
      0,
      Math.min(
        itemCount - 1,
        startIndex + visibleItems - 1 // -1 is because stop index is inclusive
      )
    );
  },

  initInstanceProps(props: Props<any>): any {
    // Noop
  },

  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: ({ itemSize }: Props<any>): void => {
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
