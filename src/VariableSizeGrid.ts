// @flow

import createGridComponent from './createGridComponent';

import type { Props, ScrollToAlign } from './createGridComponent';

const DEFAULT_ESTIMATED_ITEM_SIZE = 50;

type VariableSizeProps = {|
  estimatedColumnWidth: number,
  estimatedRowHeight: number,
  ...Props<any>,
|};

type itemSizeGetter = (index: number) => number;
type ItemType = 'column' | 'row';

type ItemMetadata = {|
  offset: number,
  size: number,
|};
type ItemMetadataMap = { [index: number]: ItemMetadata };
type InstanceProps = {|
  columnMetadataMap: ItemMetadataMap,
  estimatedColumnWidth: number,
  estimatedRowHeight: number,
  lastMeasuredColumnIndex: number,
  lastMeasuredRowIndex: number,
  rowMetadataMap: ItemMetadataMap,
|};

const getEstimatedTotalHeight = (
  { rowCount }: Props<any>,
  { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps
) => {
  let totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredRowIndex >= rowCount) {
    lastMeasuredRowIndex = rowCount - 1;
  }

  if (lastMeasuredRowIndex >= 0) {
    const itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

const getEstimatedTotalWidth = (
  { columnCount }: Props<any>,
  {
    columnMetadataMap,
    estimatedColumnWidth,
    lastMeasuredColumnIndex,
  }: InstanceProps
) => {
  let totalSizeOfMeasuredRows = 0;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredColumnIndex >= columnCount) {
    lastMeasuredColumnIndex = columnCount - 1;
  }

  if (lastMeasuredColumnIndex >= 0) {
    const itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

const getItemMetadata = (
  itemType: ItemType,
  props: Props<any>,
  index: number,
  instanceProps: InstanceProps
): ItemMetadata => {
  let itemMetadataMap, itemSize, lastMeasuredIndex;
  if (itemType === 'column') {
    itemMetadataMap = instanceProps.columnMetadataMap;
    itemSize = ((props.columnWidth: any): itemSizeGetter);
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    itemSize = ((props.rowHeight: any): itemSizeGetter);
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = itemSize(i);

      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    if (itemType === 'column') {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }

  return itemMetadataMap[index];
};

const findNearestItem = (
  itemType: ItemType,
  props: Props<any>,
  instanceProps: InstanceProps,
  offset: number
) => {
  let itemMetadataMap, lastMeasuredIndex;
  if (itemType === 'column') {
    itemMetadataMap = instanceProps.columnMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  const lastMeasuredItemOffset =
    lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredItemOffset >= offset) {
    // If we've already measured items within this range just use a binary search as it's faster.
    return findNearestItemBinarySearch(
      itemType,
      props,
      instanceProps,
      lastMeasuredIndex,
      0,
      offset
    );
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestItemExponentialSearch(
      itemType,
      props,
      instanceProps,
      Math.max(0, lastMeasuredIndex),
      offset
    );
  }
};

const findNearestItemBinarySearch = (
  itemType: ItemType,
  props: Props<any>,
  instanceProps: InstanceProps,
  high: number,
  low: number,
  offset: number
): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata(
      itemType,
      props,
      middle,
      instanceProps
    ).offset;

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

const findNearestItemExponentialSearch = (
  itemType: ItemType,
  props: Props<any>,
  instanceProps: InstanceProps,
  index: number,
  offset: number
): number => {
  const itemCount = itemType === 'column' ? props.columnCount : props.rowCount;
  let interval = 1;

  while (
    index < itemCount &&
    getItemMetadata(itemType, props, index, instanceProps).offset < offset
  ) {
    index += interval;
    interval *= 2;
  }

  return findNearestItemBinarySearch(
    itemType,
    props,
    instanceProps,
    Math.min(index, itemCount - 1),
    Math.floor(index / 2),
    offset
  );
};

const getOffsetForIndexAndAlignment = (
  itemType: ItemType,
  props: Props<any>,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number,
  instanceProps: InstanceProps,
  scrollbarSize: number
): number => {
  const size = itemType === 'column' ? props.width : props.height;
  const itemMetadata = getItemMetadata(itemType, props, index, instanceProps);

  // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.
  const estimatedTotalSize =
    itemType === 'column'
      ? getEstimatedTotalWidth(props, instanceProps)
      : getEstimatedTotalHeight(props, instanceProps);

  const maxOffset = Math.max(
    0,
    Math.min(estimatedTotalSize - size, itemMetadata.offset)
  );
  const minOffset = Math.max(
    0,
    itemMetadata.offset - size + scrollbarSize + itemMetadata.size
  );

  if (align === 'smart') {
    if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
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
    case 'center':
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case 'auto':
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        // Because we only take into account the scrollbar size when calculating minOffset
        // this value can be larger than maxOffset when at the end of the list
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
  }
};

const VariableSizeGrid = createGridComponent({
  getColumnOffset: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => getItemMetadata('column', props, index, instanceProps).offset,

  getColumnStartIndexForOffset: (
    props: Props<any>,
    scrollLeft: number,
    instanceProps: InstanceProps
  ): number => findNearestItem('column', props, instanceProps, scrollLeft),

  getColumnStopIndexForStartIndex: (
    props: Props<any>,
    startIndex: number,
    scrollLeft: number,
    instanceProps: InstanceProps
  ): number => {
    const { columnCount, width } = props;

    const itemMetadata = getItemMetadata(
      'column',
      props,
      startIndex,
      instanceProps
    );
    const maxOffset = scrollLeft + width;

    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;

    while (stopIndex < columnCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata('column', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  getColumnWidth: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => instanceProps.columnMetadataMap[index].size,

  getEstimatedTotalHeight,
  getEstimatedTotalWidth,

  getOffsetForColumnAndAlignment: (
    props: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps,
    scrollbarSize: number
  ): number =>
    getOffsetForIndexAndAlignment(
      'column',
      props,
      index,
      align,
      scrollOffset,
      instanceProps,
      scrollbarSize
    ),

  getOffsetForRowAndAlignment: (
    props: Props<any>,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps,
    scrollbarSize: number
  ): number =>
    getOffsetForIndexAndAlignment(
      'row',
      props,
      index,
      align,
      scrollOffset,
      instanceProps,
      scrollbarSize
    ),

  getRowOffset: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => getItemMetadata('row', props, index, instanceProps).offset,

  getRowHeight: (
    props: Props<any>,
    index: number,
    instanceProps: InstanceProps
  ): number => instanceProps.rowMetadataMap[index].size,

  getRowStartIndexForOffset: (
    props: Props<any>,
    scrollTop: number,
    instanceProps: InstanceProps
  ): number => findNearestItem('row', props, instanceProps, scrollTop),

  getRowStopIndexForStartIndex: (
    props: Props<any>,
    startIndex: number,
    scrollTop: number,
    instanceProps: InstanceProps
  ): number => {
    const { rowCount, height } = props;

    const itemMetadata = getItemMetadata(
      'row',
      props,
      startIndex,
      instanceProps
    );
    const maxOffset = scrollTop + height;

    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;

    while (stopIndex < rowCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemMetadata('row', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps(props: Props<any>, instance: any): InstanceProps {
    const {
      estimatedColumnWidth,
      estimatedRowHeight,
    } = ((props: any): VariableSizeProps);

    const instanceProps = {
      columnMetadataMap: {},
      estimatedColumnWidth: estimatedColumnWidth || DEFAULT_ESTIMATED_ITEM_SIZE,
      estimatedRowHeight: estimatedRowHeight || DEFAULT_ESTIMATED_ITEM_SIZE,
      lastMeasuredColumnIndex: -1,
      lastMeasuredRowIndex: -1,
      rowMetadataMap: {},
    };

    instance.resetAfterColumnIndex = (
      columnIndex: number,
      shouldForceUpdate?: boolean = true
    ) => {
      instance.resetAfterIndices({ columnIndex, shouldForceUpdate });
    };

    instance.resetAfterRowIndex = (
      rowIndex: number,
      shouldForceUpdate?: boolean = true
    ) => {
      instance.resetAfterIndices({ rowIndex, shouldForceUpdate });
    };

    instance.resetAfterIndices = ({
      columnIndex,
      rowIndex,
      shouldForceUpdate = true,
    }: {
      columnIndex?: number,
      rowIndex?: number,
      shouldForceUpdate: boolean,
    }) => {
      if (typeof columnIndex === 'number') {
        instanceProps.lastMeasuredColumnIndex = Math.min(
          instanceProps.lastMeasuredColumnIndex,
          columnIndex - 1
        );
      }
      if (typeof rowIndex === 'number') {
        instanceProps.lastMeasuredRowIndex = Math.min(
          instanceProps.lastMeasuredRowIndex,
          rowIndex - 1
        );
      }

      // We could potentially optimize further by only evicting styles after this index,
      // But since styles are only cached while scrolling is in progress-
      // It seems an unnecessary optimization.
      // It's unlikely that resetAfterIndex() will be called while a user is scrolling.
      instance._getItemStyleCache(-1);

      if (shouldForceUpdate) {
        instance.forceUpdate();
      }
    };

    return instanceProps;
  },

  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: ({ columnWidth, rowHeight }: Props<any>): void => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof columnWidth !== 'function') {
        throw Error(
          'An invalid "columnWidth" prop has been specified. ' +
            'Value should be a function. ' +
            `"${
              columnWidth === null ? 'null' : typeof columnWidth
            }" was specified.`
        );
      } else if (typeof rowHeight !== 'function') {
        throw Error(
          'An invalid "rowHeight" prop has been specified. ' +
            'Value should be a function. ' +
            `"${rowHeight === null ? 'null' : typeof rowHeight}" was specified.`
        );
      }
    }
  },
});

export default VariableSizeGrid;
