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
}): {
  startIndexVisible: number;
  stopIndexVisible: number;
  startIndexOverscan: number;
  stopIndexOverscan: number;
} {
  const maxIndex = itemCount - 1;

  let startIndexVisible = 0;
  let stopIndexVisible = -1;
  let startIndexOverscan = 0;
  let stopIndexOverscan = -1;
  let currentIndex = 0;

  while (currentIndex < maxIndex) {
    const bounds = cachedBounds.get(currentIndex);

    if (bounds.scrollOffset + bounds.size > containerScrollOffset) {
      break;
    }

    currentIndex++;
  }

  startIndexVisible = currentIndex;
  startIndexOverscan = Math.max(0, startIndexVisible - overscanCount);

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

  stopIndexVisible = Math.min(maxIndex, currentIndex);
  stopIndexOverscan = Math.min(itemCount - 1, stopIndexVisible + overscanCount);

  if (startIndexVisible < 0) {
    startIndexVisible = 0;
    stopIndexVisible = -1;
    startIndexOverscan = 0;
    stopIndexOverscan = -1;
  }

  return {
    startIndexVisible,
    stopIndexVisible,
    startIndexOverscan,
    stopIndexOverscan
  };
}
