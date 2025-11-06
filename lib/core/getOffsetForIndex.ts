import type { Align } from "../types";
import { getEstimatedSize } from "./getEstimatedSize";
import type { CachedBounds, SizeFunction } from "./types";

export function getOffsetForIndex<Props extends object>({
  align,
  cachedBounds,
  index,
  itemCount,
  itemSize,
  containerScrollOffset,
  containerSize
}: {
  align: Align;
  cachedBounds: CachedBounds;
  index: number;
  itemCount: number;
  itemSize: number | SizeFunction<Props>;
  containerScrollOffset: number;
  containerSize: number;
}) {
  if (index < 0 || index >= itemCount) {
    throw RangeError(`Invalid index specified: ${index}`, {
      cause: `Index ${index} is not within the range of 0 - ${itemCount - 1}`
    });
  }

  const estimatedTotalSize = getEstimatedSize({
    cachedBounds,
    itemCount,
    itemSize
  });

  const bounds = cachedBounds.get(index);
  const maxOffset = Math.max(
    0,
    Math.min(estimatedTotalSize - containerSize, bounds.scrollOffset)
  );
  const minOffset = Math.max(
    0,
    bounds.scrollOffset - containerSize + bounds.size
  );

  if (align === "smart") {
    if (
      containerScrollOffset >= minOffset &&
      containerScrollOffset <= maxOffset
    ) {
      align = "auto";
    } else {
      align = "center";
    }
  }

  switch (align) {
    case "start": {
      return maxOffset;
    }
    case "end": {
      return minOffset;
    }
    case "center": {
      if (bounds.scrollOffset <= containerSize / 2) {
        // Too near the beginning to center-align
        return 0;
      } else if (
        bounds.scrollOffset + bounds.size / 2 >=
        estimatedTotalSize - containerSize / 2
      ) {
        // Too near the end to center-align
        return estimatedTotalSize - containerSize;
      } else {
        return bounds.scrollOffset + bounds.size / 2 - containerSize / 2;
      }
    }
    case "auto":
    default: {
      if (
        containerScrollOffset >= minOffset &&
        containerScrollOffset <= maxOffset
      ) {
        return containerScrollOffset;
      } else if (containerScrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
    }
  }
}
