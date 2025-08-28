import type { CachedBounds } from "./types";

export function getStartStopIndices({
  cachedBounds,
  containerScrollOffset,
  containerSize,
  itemCount,
  overscanCount
}: {
  cachedBounds: CachedBounds;
  containerScrollOffset: number;
  containerSize: number;
  itemCount: number;
  overscanCount: number;
}): [number, number] {
  const maxIndex = itemCount - 1;

  let startIndex = 0;
  let stopIndex = -1;
  let currentIndex = 0;

  while (currentIndex < maxIndex) {
    const bounds = cachedBounds.get(currentIndex);

    if (bounds.scrollOffset + bounds.size > containerScrollOffset) {
      break;
    }

    currentIndex++;
  }

  startIndex = currentIndex;
  startIndex = Math.max(0, startIndex - overscanCount);

  while (currentIndex < maxIndex) {
    const bounds = cachedBounds.get(currentIndex);

    if (
      bounds.scrollOffset + bounds.size >=
      containerScrollOffset + containerSize
    ) {
      break;
    }

    currentIndex++;
  }

  stopIndex = Math.min(maxIndex, currentIndex);
  stopIndex = Math.min(itemCount - 1, stopIndex + overscanCount);

  return startIndex < 0 ? [0, -1] : [startIndex, stopIndex];
}
