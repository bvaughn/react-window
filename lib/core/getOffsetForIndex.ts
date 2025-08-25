import type { Align } from "../types";
import type { CachedBounds } from "./types";

export function getOffsetForIndex({
  align,
  cachedBounds,
  index,
  itemCount,
  containerScrollOffset,
  containerSize
}: {
  align: Align;
  cachedBounds: CachedBounds;
  index: number;
  itemCount: number;
  containerScrollOffset: number;
  containerSize: number;
}) {
  const lastCellOffset = cachedBounds.get(itemCount - 1).scrollOffset;

  const maxScrollOffset = lastCellOffset + lastCellOffset - containerSize;
  const alignEndScrollOffset = Math.max(
    0,
    cachedBounds.get(index + 1).scrollOffset - containerSize
  );
  const alignStartScrollOffset = Math.min(
    lastCellOffset,
    cachedBounds.get(index).scrollOffset
  );

  if (align === "smart") {
    if (
      containerScrollOffset >= alignEndScrollOffset &&
      containerScrollOffset <= alignStartScrollOffset
    ) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start":
      return Math.min(maxScrollOffset, alignStartScrollOffset);
    case "end":
      return alignEndScrollOffset;
    case "center": {
      // "Centered" offset is usually the average of the min and max.
      // But near the edges of the list, this doesn't hold true.
      const middleOffset = Math.round(
        alignEndScrollOffset +
          (alignStartScrollOffset - alignEndScrollOffset) / 2
      );
      if (middleOffset < Math.ceil(containerSize / 2)) {
        // Too near the beginning to center align
        return 0;
      } else if (middleOffset > maxScrollOffset) {
        // Too near the end to center align
        return maxScrollOffset;
      } else {
        return middleOffset;
      }
    }
    case "auto":
    default:
      if (
        containerScrollOffset >= alignEndScrollOffset &&
        containerScrollOffset <= alignStartScrollOffset
      ) {
        return containerScrollOffset;
      } else if (containerScrollOffset < alignEndScrollOffset) {
        return alignEndScrollOffset;
      } else {
        return alignStartScrollOffset;
      }
  }
}
