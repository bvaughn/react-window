// @flow

import { createElement } from 'react';

import createListComponent, { defaultItemKey } from './createListComponent';
import CellMeasurer from './CellMeasurer';

import type { Props, ScrollToAlign } from './createListComponent';

const DEFAULT_ESTIMATED_ITEM_SIZE = 50;

type DynanmicProps = {|
  estimatedItemSize: number,
  ...Props<any>,
|};

export type HandleNewMeasurements = (
  index: number,
  newSize: number,
  isCommitPhase: boolean
) => void;

type ItemMetadata = {|
  offset: number,
  size: number,
|};
type InstanceProps = {|
  estimatedItemSize: number,
  itemOffsetMap: { [index: number]: number },
  itemSizeMap: { [index: number]: number },
  lastMeasuredIndex: number,
  lastPositionedIndex: number,
  totalMeasuredSize: number,
|};

const getItemMetadata = (
  props: Props<any>,
  index: number,
  instanceProps: InstanceProps
): ItemMetadata => {
  const {
    estimatedItemSize,
    itemOffsetMap,
    itemSizeMap,
    lastMeasuredIndex,
    lastPositionedIndex,
  } = instanceProps;

  // If the specified item has not yet been measured,
  // Just return an estimated size for now.
  if (index > lastMeasuredIndex) {
    return {
      offset: 0,
      size: estimatedItemSize,
    };
  }

  // Lazily update positions if they are stale.
  if (index > lastPositionedIndex) {
    if (lastPositionedIndex < 0) {
      itemOffsetMap[0] = 0;
    }

    for (let i = Math.max(1, lastPositionedIndex); i <= index; i++) {
      const prevOffset = itemOffsetMap[i - 1];
      const prevSize = itemSizeMap[i - 1];

      itemOffsetMap[i] = prevOffset + prevSize;
    }

    instanceProps.lastPositionedIndex = index;
  }

  let offset = itemOffsetMap[index];
  let size = itemSizeMap[index];

  return { offset, size };
};

const findNearestItemBinarySearch = (
  props: Props<any>,
  instanceProps: InstanceProps,
  high: number,
  low: number,
  offset: number
): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata(props, middle, instanceProps).offset;

    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

const getEstimatedTotalSize = (
  { itemCount }: Props<any>,
  {
    itemSizeMap,
    estimatedItemSize,
    lastMeasuredIndex,
    totalMeasuredSize,
  }: InstanceProps
) =>
  totalMeasuredSize + (itemCount - lastMeasuredIndex - 1) * estimatedItemSize;

const DynamicSizeList = createListComponent({
  getItemOffset: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => getItemMetadata(props, index, instanceProps).offset,

  getItemSize: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => {
    if (index > instanceProps.lastMeasuredIndex) {
      return instanceProps.estimatedItemSize;
    } else {
      return instanceProps.itemSizeMap[index];
    }
  },

  getEstimatedTotalSize,

  getOffsetForIndexAndAlignment: (
    props: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps
  ): number => {
    const { direction, height, width } = props;

    const size = (((direction === 'horizontal' ? width : height): any): number);
    const itemMetadata = getItemMetadata(props, index, instanceProps);

    // Get estimated total size after ItemMetadata is computed,
    // To ensure it reflects actual measurements instead of just estimates.
    const estimatedTotalSize = getEstimatedTotalSize(props, instanceProps);

    const maxOffset = Math.min(estimatedTotalSize - size, itemMetadata.offset);
    const minOffset = Math.max(
      0,
      itemMetadata.offset - size + itemMetadata.size
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
    props: Props<any>,
    offset: number,
    instanceProps: InstanceProps
  ): number => {
    const { lastMeasuredIndex, totalMeasuredSize } = instanceProps;

    // If we've already positioned and measured past this point,
    // Use a binary search to find the closets cell.
    if (offset <= totalMeasuredSize) {
      return findNearestItemBinarySearch(
        props,
        instanceProps,
        lastMeasuredIndex,
        0,
        offset
      );
    }

    // Otherwise render a new batch of items starting from where we left off.
    return lastMeasuredIndex + 1;
  },

  getStopIndexForStartIndex: (
    props: Props<any>,
    startIndex: number,
    scrollOffset: number,
    instanceProps: InstanceProps
  ): number => {
    const { direction, height, itemCount, width } = props;

    const size = (((direction === 'horizontal' ? width : height): any): number);
    const itemMetadata = getItemMetadata(props, startIndex, instanceProps);
    const maxOffset = scrollOffset + size;

    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;

    while (stopIndex < itemCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata(props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps(props: Props<any>, instance: any): InstanceProps {
    const { estimatedItemSize } = ((props: any): DynanmicProps);

    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE,
      itemOffsetMap: {},
      itemSizeMap: {},
      lastMeasuredIndex: -1,
      lastPositionedIndex: -1,
      totalMeasuredSize: 0,
    };

    let hasNewMeasurements: boolean = false;

    // TODO Cancel pending debounce on unmount
    let debounceForceUpdateID = null;
    const debounceForceUpdate = () => {
      if (debounceForceUpdateID === null) {
        debounceForceUpdateID = setTimeout(() => {
          debounceForceUpdateID = null;
          instance.forceUpdate();
        }, 1);
      }
    };

    // List calls this method automatically after "mount" and "update".
    instance._commitHook = () => {
      if (hasNewMeasurements) {
        hasNewMeasurements = false;

        // We could potentially optimize further by only evicting styles after this index,
        // But since styles are only cached while scrolling is in progress-
        // It seems an unnecessary optimization.
        // It's unlikely that resetAfterIndex() will be called while a user is scrolling.
        instance._itemStyleCache = {};
        instance.forceUpdate();
      }
    };

    // This function may be called out of order!
    // It is not safe to reposition items here.
    // Be careful when comparing index and lastMeasuredIndex.
    const handleNewMeasurements: HandleNewMeasurements = (
      index: number,
      newSize: number,
      isCommitPhase: boolean
    ) => {
      const {
        itemSizeMap,
        lastMeasuredIndex,
        lastPositionedIndex,
      } = instanceProps;

      const oldSize = itemSizeMap[index];

      // Mark offsets after this as stale so that getItemMetadata() will lazily recalculate it.
      if (index < lastPositionedIndex) {
        instanceProps.lastPositionedIndex = index;
      }

      if (index <= lastMeasuredIndex) {
        if (oldSize === newSize) {
          return;
        }

        // Adjust total size estimate by the delta in size.
        instanceProps.totalMeasuredSize += newSize - oldSize;
      } else {
        instanceProps.lastMeasuredIndex = index;
        instanceProps.totalMeasuredSize += newSize;
      }

      itemSizeMap[index] = newSize;

      if (isCommitPhase) {
        hasNewMeasurements = true;
      } else {
        debounceForceUpdate();
      }
    };
    instance._handleNewMeasurements = handleNewMeasurements;

    // Override the item-rendering process to wrap items with CellMeasurer.
    // This keep the external API simpler.
    instance._renderItems = () => {
      const {
        children,
        direction,
        height,
        itemCount,
        itemKey = defaultItemKey,
        useIsScrolling,
        width,
      } = instance.props;
      const { isScrolling } = instance.state;

      const [startIndex, stopIndex] = instance._getRangeToRender();

      const items = [];
      if (itemCount > 0) {
        const { lastMeasuredIndex } = instanceProps;

        for (let index = startIndex; index <= stopIndex; index++) {
          let style = instance._getItemStyle(index);

          const { offset, size } = getItemMetadata(
            instance.props,
            index,
            instanceProps
          );

          if (index > lastMeasuredIndex) {
            // Strip hard-coded dimensions from the inline style.
            // These would interfere with the item laying itself out anyway.
            // Constrain the item to fill either the width or height of the list,
            // Depending on the direction being windowed.
            style = {
              ...style,
              height: direction === 'horizontal' ? height : undefined,
              width: direction === 'vertical' ? width : undefined,
            };
          } else {
            style = {
              ...style,
              height: direction === 'horizontal' ? '100%' : undefined,
              width: direction === 'vertical' ? '100%' : undefined,
              left: direction === 'horizontal' ? offset : 0,
              top: direction === 'vertical' ? offset : 0,
            };
          }

          const item = createElement(children, {
            index,
            isScrolling: useIsScrolling ? isScrolling : undefined,
            style,
          });

          // Always wrap children in a CellMeasurer.
          // We could only wrap them for the initial render,
          // But we also want to automatically detect resizes.
          items.push(
            createElement(CellMeasurer, {
              direction,
              handleNewMeasurements: instance._handleNewMeasurements,
              index,
              item,
              key: itemKey(index),
              size,
            })
          );
        }
      }
      return items;
    };

    // TODO Add reset methods:
    // resetItem(index)
    // resetAllItems()

    return instanceProps;
  },

  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: ({ itemSize }: Props<any>): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (itemSize !== undefined) {
        throw Error('An unexpected "itemSize" prop has been provided.');
      }
    }
  },
});

export default DynamicSizeList;
