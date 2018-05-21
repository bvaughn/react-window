// @flow

import createListComponent from './createListComponent';

import type { Props, ScrollToAlign } from './createListComponent';

const DEFAULT_ESTIMATED_CELL_SIZE = 50;

type DynanmicProps = {|
  estimatedCellSize: number,
  ...Props,
|};

type CelLSizeGetter = (index: number) => number;

type CellMetadata = {|
  offset: number,
  size: number,
|};
type InstanceProps = {|
  cellMetadataMap: { [index: number]: CellMetadata },
  estimatedCellSize: number,
  lastMeasuredIndex: number,
|};

const getCellMetadata = (
  props: Props,
  index: number,
  instanceProps: InstanceProps
): CellMetadata => {
  const { cellSize, estimatedCellSize } = ((props: any): DynanmicProps);
  const { cellMetadataMap, lastMeasuredIndex } = instanceProps;

  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const cellMetadata = cellMetadataMap[lastMeasuredIndex];
      offset = cellMetadata.offset + cellMetadata.size;
    }

    for (var i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = ((cellSize: any): CelLSizeGetter)(i);

      cellMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;

      instanceProps.lastMeasuredIndex = index;
    }
  }

  return cellMetadataMap[index];
};

const findNearestCell = (
  props: Props,
  instanceProps: InstanceProps,
  offset: number
) => {
  const {
    cellMetadataMap,
    estimatedCellSize,
    lastMeasuredIndex,
  } = instanceProps;

  const lastMeasuredCellOffset =
    lastMeasuredIndex > 0 ? cellMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredCellOffset >= offset) {
    // If we've already measured cells within this range just use a binary search as it's faster.
    return findNearestCellBinarySearch(
      props,
      instanceProps,
      lastMeasuredIndex,
      0,
      offset
    );
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of cells as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestCellExponentialSearch(
      props,
      instanceProps,
      lastMeasuredIndex,
      offset
    );
  }
};

const findNearestCellBinarySearch = (
  props: Props,
  instanceProps: InstanceProps,
  high: number,
  low: number,
  offset: number
): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getCellMetadata(props, middle, instanceProps).offset;

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

const findNearestCellExponentialSearch = (
  props: Props,
  instanceProps: InstanceProps,
  index: number,
  offset: number
): number => {
  const { count } = props;
  let interval = 1;

  while (
    index < count &&
    getCellMetadata(props, index, instanceProps).offset < offset
  ) {
    index += interval;
    interval *= 2;
  }

  return findNearestCellBinarySearch(
    props,
    instanceProps,
    Math.min(index, count - 1),
    Math.floor(index / 2),
    offset
  );
};

const DynamicList = createListComponent({
  getCellOffset: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => getCellMetadata(props, index, instanceProps).offset,

  // TODO Should this read from the CellMetadata cache instead?
  getCellSize: ({ cellSize, size }: Props, index: number): number =>
    ((cellSize: any): Function)(index),

  getEstimatedTotalSize: (
    { count }: Props,
    { cellMetadataMap, estimatedCellSize, lastMeasuredIndex }: InstanceProps
  ) => {
    let totalSizeOfMeasuredCells = 0;

    if (lastMeasuredIndex >= 0) {
      const cellMetadata = cellMetadataMap[lastMeasuredIndex];
      totalSizeOfMeasuredCells = cellMetadata.offset + cellMetadata.size;
    }

    const numUnmeasuredCells = count - lastMeasuredIndex - 1;
    const totalSizeOfUnmeasuredCells = numUnmeasuredCells * estimatedCellSize;

    return totalSizeOfMeasuredCells + totalSizeOfUnmeasuredCells;
  },

  getOffsetForIndexAndAlignment: (
    props: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps
  ): number => {
    const { direction, height, width } = props;

    const size = (((direction === 'horizontal' ? width : height): any): number);
    const cellMetadata = getCellMetadata(props, index, instanceProps);
    const maxOffset = cellMetadata.offset;
    const minOffset = cellMetadata.offset - size + cellMetadata.size;

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
  ): number => findNearestCell(props, instanceProps, offset),

  getStopIndexForStartIndex: (
    props: Props,
    startIndex: number,
    instanceProps: InstanceProps
  ): number => {
    const { count, direction, height, width } = props;

    const size = (((direction === 'horizontal' ? width : height): any): number);
    const cellMetadata = getCellMetadata(props, startIndex, instanceProps);
    const maxOffset = cellMetadata.offset + size;

    let offset = cellMetadata.offset;
    let stopIndex = startIndex;

    while (stopIndex < count - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getCellMetadata(props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps(props: Props): InstanceProps {
    const { estimatedCellSize, direction } = ((props: any): DynanmicProps);

    // TODO Add resetAfterIndex() method to the prototype
    // Find a way for it to access instance properties
    // Maybe this is a method "extend prototype"?

    return {
      cellMetadataMap: {},
      estimatedCellSize: estimatedCellSize || DEFAULT_ESTIMATED_CELL_SIZE,
      lastMeasuredIndex: -1,
    };
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
