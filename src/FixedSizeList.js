// @flow

import createListComponent from "./createListComponent";

import type { Props, ScrollToAlign } from "./createListComponent";

const FixedSizeList = createListComponent({
  getCellSize: ({ cellSize, size }: Props, index: number): number =>
    ((cellSize: any): number),
  getEstimatedTotalSize: ({ cellSize, count }: Props) =>
    ((cellSize: any): number) * count,
  getOffsetForIndex: (
    { cellSize, direction, height, width }: Props,
    index: number,
    align: ScrollToAlign,
    scrollOffset: number
  ): number => {
    const maxOffset = index * ((cellSize: any): number);
    const minOffset =
      index * ((cellSize: any): number) -
      (((direction === "horizontal" ? width : height): any): number) +
      ((cellSize: any): number);

    switch (align) {
      case "start":
        return maxOffset;
      case "end":
        return minOffset;
      case "center":
        return Math.round(minOffset + (maxOffset - minOffset) / 2);
      case "auto":
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
    Math.min(count - 1, Math.floor(offset / ((cellSize: any): number))),
  getStopIndexForStartIndex: (
    { cellSize, count, direction, height, width }: Props,
    startIndex: number
  ): number => {
    const size = (((direction === "horizontal" ? width : height): any): number);
    return Math.min(
      count - 1,
      Math.round(startIndex + size / ((cellSize: any): number))
    );
  },
  validateProps: ({ cellSize }: Props): void => {
    if (typeof cellSize !== "number") {
      throw Error(
        'An invalid "cellSize" prop has been specified. ' +
          "Value should be a number. " +
          `"${cellSize === null ? "null" : typeof cellSize}" was specified.`
      );
    }
  }
});

export default FixedSizeList;
