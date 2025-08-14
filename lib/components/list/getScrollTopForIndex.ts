import type { Align } from "./types";

export function getScrollTopForIndex({
  align,
  getRowOffset,
  height,
  index,
  prevScrollTop,
  rowCount,
}: {
  align: Align;
  getRowOffset: (index: number) => number;
  height: number;
  index: number;
  prevScrollTop: number;
  rowCount: number;
}) {
  const lastRowTop = getRowOffset(rowCount - 1);
  const minScrollTop = Math.max(0, getRowOffset(index + 1) - height);
  const maxScrollTop = Math.min(lastRowTop, getRowOffset(index));

  if (align === "smart") {
    if (
      prevScrollTop >= minScrollTop - height &&
      prevScrollTop <= maxScrollTop + height
    ) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start":
      return maxScrollTop;
    case "end":
      return minScrollTop;
    case "center": {
      // "Centered" offset is usually the average of the min and max.
      // But near the edges of the list, this doesn't hold true.
      const middleOffset = Math.round(
        minScrollTop + (maxScrollTop - minScrollTop) / 2,
      );
      if (middleOffset < Math.ceil(height / 2)) {
        return 0; // near the beginning
      } else if (middleOffset > lastRowTop + Math.floor(height / 2)) {
        return lastRowTop; // near the end
      } else {
        return middleOffset;
      }
    }
    case "auto":
    default:
      if (prevScrollTop >= minScrollTop && prevScrollTop <= maxScrollTop) {
        return prevScrollTop;
      } else if (prevScrollTop < minScrollTop) {
        return minScrollTop;
      } else {
        return maxScrollTop;
      }
  }
}
