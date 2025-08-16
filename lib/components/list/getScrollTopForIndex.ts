import type { Align } from "./types";

export function getScrollTopForIndex({
  align,
  getRowOffset,
  height,
  index,
  prevScrollTop,
  rowCount,
  rowHeight,
}: {
  align: Align;
  getRowOffset: (index: number) => number;
  height: number;
  index: number;
  prevScrollTop: number;
  rowCount: number;
  rowHeight: (index: number) => number;
}) {
  const lastRowTop = getRowOffset(rowCount - 1);
  const maxScrollTop = lastRowTop + rowHeight(rowCount - 1) - height;
  const alignEndScrollTop = Math.max(0, getRowOffset(index + 1) - height);
  const alignStartScrollTop = Math.min(lastRowTop, getRowOffset(index));

  if (align === "smart") {
    if (
      prevScrollTop >= alignEndScrollTop &&
      prevScrollTop <= alignStartScrollTop
    ) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start":
      return Math.min(maxScrollTop, alignStartScrollTop);
    case "end":
      return alignEndScrollTop;
    case "center": {
      // "Centered" offset is usually the average of the min and max.
      // But near the edges of the list, this doesn't hold true.
      const middleOffset = Math.round(
        alignEndScrollTop + (alignStartScrollTop - alignEndScrollTop) / 2,
      );
      if (middleOffset < Math.ceil(height / 2)) {
        // Too near the beginning to center align
        return 0;
      } else if (middleOffset > maxScrollTop) {
        // Too near the end to center align
        return maxScrollTop;
      } else {
        return middleOffset;
      }
    }
    case "auto":
    default:
      if (
        prevScrollTop >= alignEndScrollTop &&
        prevScrollTop <= alignStartScrollTop
      ) {
        return prevScrollTop;
      } else if (prevScrollTop < alignEndScrollTop) {
        return alignEndScrollTop;
      } else {
        return alignStartScrollTop;
      }
  }
}
