// @flow

import React, { createElement, Component } from 'react';
import { findDOMNode } from 'react-dom';

import createListComponent, { defaultItemKey } from './createListComponent';

import type { Direction, Props, ScrollToAlign } from './createListComponent';

const DEFAULT_ESTIMATED_ITEM_SIZE = 50;

type DynanmicProps = {|
  estimatedItemSize: number,
  ...Props,
|};

type ItemMetadata = {|
  offset: number,
  size: number,
|};
type InstanceProps = {|
  estimatedItemSize: number,
  itemMetadataMap: { [index: number]: ItemMetadata },
  lastMeasuredIndex: number,
  totalMeasuredSize: number,
|};

const getItemMetadata = (
  props: Props,
  index: number,
  instanceProps: InstanceProps
): ItemMetadata => {
  const { estimatedItemSize, itemMetadataMap } = instanceProps;

  let itemMetadata = itemMetadataMap[index];

  // If the specified item has not yet been measured,
  // Just return an estimated size for now.
  if (itemMetadata === undefined) {
    itemMetadata = itemMetadataMap[index] = {
      offset: 0,
      size: estimatedItemSize,
    };
  }

  return itemMetadata;
};

const findNearestItemBinarySearch = (
  props: Props,
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
  { itemCount }: Props,
  {
    itemMetadataMap,
    estimatedItemSize,
    lastMeasuredIndex,
    totalMeasuredSize,
  }: InstanceProps
) =>
  totalMeasuredSize + (itemCount - lastMeasuredIndex - 1) * estimatedItemSize;

type CellMeasurerProps = {|
  direction: Direction,
  index: number,
  instance: any,
  item: React$Element<any>,
  itemMetadata: ItemMetadata,
|};
class CellMeasurer extends Component<CellMeasurerProps, void> {
  componentDidMount() {
    this._measureItem();
  }

  componentDidUpdate() {
    // TODO Check if item needs to be remeasured.
  }

  render() {
    return this.props.item;
  }

  _measureItem() {
    const { direction, index, instance, itemMetadata } = this.props;

    const node = findDOMNode(this);

    if (
      node &&
      node.ownerDocument &&
      node.ownerDocument.defaultView &&
      node instanceof node.ownerDocument.defaultView.HTMLElement
    ) {
      const size =
        direction === 'horizontal'
          ? Math.ceil(node.offsetWidth)
          : Math.ceil(node.offsetHeight);

      if (itemMetadata.size !== size) {
        instance._handleNewMeasurements(index, size);
      }
    }
  }
}

const DynamicSizeList = createListComponent({
  getItemOffset: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => getItemMetadata(props, index, instanceProps).offset,

  getItemSize: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => {
    if (index > instanceProps.lastMeasuredIndex) {
      return instanceProps.estimatedItemSize;
    } else {
      return instanceProps.itemMetadataMap[index].size;
    }
  },

  getEstimatedTotalSize,

  getOffsetForIndexAndAlignment: (
    props: Props,
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
    props: Props,
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
    props: Props,
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

  initInstanceProps(props: Props, instance: any): InstanceProps {
    const { estimatedItemSize } = ((props: any): DynanmicProps);

    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE,
      itemMetadataMap: {},
      lastMeasuredIndex: -1,
      totalMeasuredSize: 0,
    };

    let hasNewMeasurements: boolean = false;

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
    instance._handleNewMeasurements = (index: number, size: number) => {
      const { itemMetadataMap, lastMeasuredIndex } = instanceProps;

      const itemMetadata = itemMetadataMap[index];

      // Adjust item position in case new measurements were recorded.
      // This method will always be called in order (lowest to highest index),
      // So it is safe to adjust positions here.
      if (index > 0) {
        const prevItemMetadata = itemMetadataMap[index - 1];
        itemMetadata.offset = prevItemMetadata.offset + prevItemMetadata.size;
      }

      if (index <= lastMeasuredIndex) {
        if (itemMetadata.size === size) {
          return;
        }

        instanceProps.totalMeasuredSize += size - itemMetadata.size;
      } else {
        instanceProps.lastMeasuredIndex = index;
        instanceProps.totalMeasuredSize += size;
      }

      itemMetadata.size = size;

      hasNewMeasurements = true;
    };

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
        for (let index = startIndex; index <= stopIndex; index++) {
          let style = instance._getItemStyle(index);

          if (index > instanceProps.lastMeasuredIndex) {
            // Strip hard-coded dimensions from the inline style.
            // These would interfere with the item laying itself out anyway.
            // Constrain the item to fill either the width or height of the list,
            // Depending on the direction being windowed.
            style = {
              ...style,
              height: direction === 'horizontal' ? height : undefined,
              width: direction === 'vertical' ? width : undefined,
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
              index,
              instance,
              item,
              itemMetadata: instanceProps.itemMetadataMap[index],
              key: itemKey(index),
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

  validateProps: ({ itemSize }: Props): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (itemSize !== undefined) {
        throw Error('An unexpected "itemSize" prop has been provided.');
      }
    }
  },
});

export default DynamicSizeList;
