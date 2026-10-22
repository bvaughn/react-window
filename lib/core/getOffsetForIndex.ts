import type { Align } from "../types";
import { getEstimatedSize } from "./getEstimatedSize";
import type { CachedBounds, SizeFunction } from "./types";

export function getOffsetForIndex<Props extends object>({
  align,
  cachedBounds,
  clamp = true,
  index,
  itemCount,
  itemSize,
  containerScrollOffset,
  containerSize
}: {
  align: Align;
  cachedBounds: CachedBounds;
  /**
   * Clamp the offset to the list's own scrollable range.
   * Lists that scroll with an outer element can scroll beyond their own bounds (e.g. to show content above the list);
   * the outer element's scrollable range is enforced by the browser instead.
   */
  clamp?: boolean;
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

  // Populate the target bounds before estimating the total from cached sizes.
  const bounds = cachedBounds.get(index);
  const estimatedTotalSize = getEstimatedSize({
    cachedBounds,
    itemCount,
    itemSize
  });

  const clampOffset = (offset: number) =>
    clamp
      ? Math.max(0, Math.min(estimatedTotalSize - containerSize, offset))
      : offset;

  const maxOffset = clampOffset(bounds.scrollOffset);
  const minOffset = clamp
    ? Math.max(0, bounds.scrollOffset - containerSize + bounds.size)
    : bounds.scrollOffset - containerSize + bounds.size;

  // Visibility depends on the row itself, not the estimated scroll extent.
  // For oversized rows, leave the offset alone when the row fills the viewport.
  const isVisible =
    bounds.size > containerSize
      ? containerScrollOffset >= bounds.scrollOffset &&
        containerScrollOffset <= minOffset
      : containerScrollOffset >= minOffset &&
        containerScrollOffset <= bounds.scrollOffset;

  if (align === "smart") {
    align = isVisible ? "auto" : "center";
  }

  switch (align) {
    case "start": {
      return maxOffset;
    }
    case "end": {
      return minOffset;
    }
    case "center": {
      return clampOffset(
        bounds.scrollOffset + bounds.size / 2 - containerSize / 2
      );
    }
    case "auto":
    default: {
      if (isVisible) {
        return containerScrollOffset;
      } else if (containerScrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
    }
  }
}
