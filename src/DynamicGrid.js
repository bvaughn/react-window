// @flow

import createGridComponent from './createGridComponent';

import type { Props, ScrollToAlign } from './createGridComponent';

const DEFAULT_ESTIMATED_CELL_SIZE = 50;

type DynanmicProps = {|
  estimatedColumnWidth: number,
  estimatedRowHeight: number,
  ...Props,
|};

type cellSizeGetter = (index: number) => number;
type CellType = 'column' | 'row';

type CellMetadata = {|
  offset: number,
  size: number,
|};
type CellMetadataMap = { [index: number]: CellMetadata };
type InstanceProps = {|
  columnMetadataMap: CellMetadataMap,
  estimatedColumnWidth: number,
  estimatedRowHeight: number,
  lastMeasuredColumnIndex: number,
  lastMeasuredRowIndex: number,
  rowMetadataMap: CellMetadataMap,
|};

const getCellMetadata = (
  cellType: CellType,
  props: Props,
  index: number,
  instanceProps: InstanceProps
): CellMetadata => {
  let cellMetadataMap, cellSize, estimatedCellSize, lastMeasuredIndex;
  if (cellType === 'column') {
    cellMetadataMap = instanceProps.columnMetadataMap;
    cellSize = ((props.columnWidth: any): cellSizeGetter);
    estimatedCellSize = instanceProps.estimatedColumnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    cellMetadataMap = instanceProps.rowMetadataMap;
    cellSize = ((props.rowHeight: any): cellSizeGetter);
    estimatedCellSize = instanceProps.estimatedRowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const cellMetadata = cellMetadataMap[lastMeasuredIndex];
      offset = cellMetadata.offset + cellMetadata.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = cellSize(i);

      cellMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    if (cellType === 'column') {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }

  return cellMetadataMap[index];
};

const findNearestCell = (
  cellType: CellType,
  props: Props,
  instanceProps: InstanceProps,
  offset: number
) => {
  let cellMetadataMap, estimatedCellSize, lastMeasuredIndex;
  if (cellType === 'column') {
    cellMetadataMap = instanceProps.columnMetadataMap;
    estimatedCellSize = instanceProps.estimatedColumnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    cellMetadataMap = instanceProps.rowMetadataMap;
    estimatedCellSize = instanceProps.estimatedRowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  const lastMeasuredCellOffset =
    lastMeasuredIndex > 0 ? cellMetadataMap[lastMeasuredIndex].offset : 0;

  if (lastMeasuredCellOffset >= offset) {
    // If we've already measured cells within this range just use a binary search as it's faster.
    return findNearestCellBinarySearch(
      cellType,
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
      cellType,
      props,
      instanceProps,
      lastMeasuredIndex,
      offset
    );
  }
};

const findNearestCellBinarySearch = (
  cellType: CellType,
  props: Props,
  instanceProps: InstanceProps,
  high: number,
  low: number,
  offset: number
): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getCellMetadata(
      cellType,
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

const findNearestCellExponentialSearch = (
  cellType: CellType,
  props: Props,
  instanceProps: InstanceProps,
  index: number,
  offset: number
): number => {
  const count = cellType === 'column' ? props.columnCount : props.rowCount;
  let interval = 1;

  while (
    index < count &&
    getCellMetadata(cellType, props, index, instanceProps).offset < offset
  ) {
    index += interval;
    interval *= 2;
  }

  return findNearestCellBinarySearch(
    cellType,
    props,
    instanceProps,
    Math.min(index, count - 1),
    Math.floor(index / 2),
    offset
  );
};

const getOffsetForIndexAndAlignment = (
  cellType: CellType,
  props: Props,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number,
  instanceProps: InstanceProps
): number => {
  const size = cellType === 'column' ? props.width : props.height;
  const cellMetadata = getCellMetadata(cellType, props, index, instanceProps);
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
};

const DynamicGrid = createGridComponent({
  getColumnOffset: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => getCellMetadata('column', props, index, instanceProps).offset,

  getColumnStartIndexForOffset: (
    props: Props,
    offset: number,
    instanceProps: InstanceProps
  ): number => findNearestCell('column', props, instanceProps, offset),

  getColumnStopIndexForStartIndex: (
    props: Props,
    startIndex: number,
    instanceProps: InstanceProps
  ): number => {
    const { columnCount, width } = props;

    const cellMetadata = getCellMetadata(
      'column',
      props,
      startIndex,
      instanceProps
    );
    const maxOffset = cellMetadata.offset + width;

    let offset = cellMetadata.offset;
    let stopIndex = startIndex;

    while (stopIndex < columnCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getCellMetadata('column', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  getColumnWidth: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => instanceProps.columnMetadataMap[index].size,

  getEstimatedTotalHeight: (
    { rowCount }: Props,
    { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps
  ) => {
    let totalSizeOfMeasuredRows = 0;

    if (lastMeasuredRowIndex >= 0) {
      const cellMetadata = rowMetadataMap[lastMeasuredRowIndex];
      totalSizeOfMeasuredRows = cellMetadata.offset + cellMetadata.size;
    }

    const numUnmeasuredCells = rowCount - lastMeasuredRowIndex - 1;
    const totalSizeOfUnmeasuredCells = numUnmeasuredCells * estimatedRowHeight;

    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredCells;
  },

  getEstimatedTotalWidth: (
    { columnCount }: Props,
    {
      columnMetadataMap,
      estimatedColumnWidth,
      lastMeasuredColumnIndex,
    }: InstanceProps
  ) => {
    let totalSizeOfMeasuredRows = 0;

    if (lastMeasuredColumnIndex >= 0) {
      const cellMetadata = columnMetadataMap[lastMeasuredColumnIndex];
      totalSizeOfMeasuredRows = cellMetadata.offset + cellMetadata.size;
    }

    const numUnmeasuredCells = columnCount - lastMeasuredColumnIndex - 1;
    const totalSizeOfUnmeasuredCells =
      numUnmeasuredCells * estimatedColumnWidth;

    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredCells;
  },

  getOffsetForColumnAndAlignment: (
    props: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps
  ): number =>
    getOffsetForIndexAndAlignment(
      'column',
      props,
      index,
      align,
      scrollOffset,
      instanceProps
    ),

  getOffsetForRowAndAlignment: (
    props: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number,
    instanceProps: InstanceProps
  ): number =>
    getOffsetForIndexAndAlignment(
      'row',
      props,
      index,
      align,
      scrollOffset,
      instanceProps
    ),

  getRowOffset: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => getCellMetadata('row', props, index, instanceProps).offset,

  getRowHeight: (
    props: Props,
    index: number,
    instanceProps: InstanceProps
  ): number => instanceProps.rowMetadataMap[index].size,

  getRowStartIndexForOffset: (
    props: Props,
    offset: number,
    instanceProps: InstanceProps
  ): number => findNearestCell('row', props, instanceProps, offset),

  getRowStopIndexForStartIndex: (
    props: Props,
    startIndex: number,
    instanceProps: InstanceProps
  ): number => {
    const { rowCount, height } = props;

    const cellMetadata = getCellMetadata(
      'row',
      props,
      startIndex,
      instanceProps
    );
    const maxOffset = cellMetadata.offset + height;

    let offset = cellMetadata.offset;
    let stopIndex = startIndex;

    while (stopIndex < rowCount - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getCellMetadata('row', props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps(props: Props, instance: any): InstanceProps {
    const {
      estimatedColumnWidth,
      estimatedRowHeight,
    } = ((props: any): DynanmicProps);

    const instanceProps = {
      columnMetadataMap: {},
      estimatedColumnWidth: estimatedColumnWidth || DEFAULT_ESTIMATED_CELL_SIZE,
      estimatedRowHeight: estimatedRowHeight || DEFAULT_ESTIMATED_CELL_SIZE,
      lastMeasuredColumnIndex: -1,
      lastMeasuredRowIndex: -1,
      rowMetadataMap: {},
    };

    instance.resetAfterColumnIndex = (index: number) => {
      instanceProps.lastMeasuredColumnIndex = index - 1;
    };

    instance.resetAfterRowIndex = (index: number) => {
      instanceProps.lastMeasuredRowIndex = index - 1;
    };

    return instanceProps;
  },

  validateProps: ({ columnWidth, rowHeight }: Props): void => {
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

export default DynamicGrid;
