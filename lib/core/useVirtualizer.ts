import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useIsHydrating } from "../hooks/useIsHydrating";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useStableCallback } from "../hooks/useStableCallback";
import type { Align } from "../types";
import { adjustScrollOffsetForRtl } from "../utils/adjustScrollOffsetForRtl";
import { isRtl as isRtlUtil } from "../utils/isRtl";
import { shallowCompare } from "../utils/shallowCompare";
import { getEstimatedSize as getEstimatedSizeUtil } from "./getEstimatedSize";
import { getOffsetForIndex } from "./getOffsetForIndex";
import { getStartStopIndices as getStartStopIndicesUtil } from "./getStartStopIndices";
import type { Direction, SizeFunction } from "./types";
import { useCachedBounds } from "./useCachedBounds";
import { useItemSize } from "./useItemSize";

export function useVirtualizer<Props extends object>({
  containerElement,
  containerStyle,
  defaultContainerSize = 0,
  defaultScrollOffset = 0,
  direction,
  isRtl = false,
  itemCount,
  itemProps,
  itemSize: itemSizeProp,
  onResize,
  overscanCount
}: {
  containerElement: HTMLElement | null;
  containerStyle?: CSSProperties;
  defaultContainerSize?: number;
  defaultScrollOffset?: number;
  direction: Direction;
  isRtl?: boolean;
  itemCount: number;
  itemProps: Props;
  itemSize: number | string | SizeFunction<Props>;
  onResize:
    | ((
        size: { height: number; width: number },
        prevSize: { height: number; width: number }
      ) => void)
    | undefined;
  overscanCount: number;
}) {
  const { height = defaultContainerSize, width = defaultContainerSize } =
    useResizeObserver({
      defaultHeight:
        direction === "vertical" ? defaultContainerSize : undefined,
      defaultWidth:
        direction === "horizontal" ? defaultContainerSize : undefined,
      element: containerElement,
      mode: direction === "vertical" ? "only-height" : "only-width",
      style: containerStyle
    });

  const prevSizeRef = useRef<{ height: number; width: number }>({
    height: 0,
    width: 0
  });

  const containerSize = direction === "vertical" ? height : width;

  const itemSize = useItemSize({ containerSize, itemSize: itemSizeProp });

  useIsomorphicLayoutEffect(() => {
    if (typeof onResize === "function") {
      const prevSize = prevSizeRef.current;

      if (prevSize.height !== height || prevSize.width !== width) {
        onResize({ height, width }, { ...prevSize });

        prevSize.height = height;
        prevSize.width = width;
      }
    }
  }, [height, onResize, width]);

  const cachedBounds = useCachedBounds({
    itemCount,
    itemProps,
    itemSize
  });

  // Server-rendered HTML can't be scrolled, so the server (and hydration) render always starts at offset 0;
  // the default scroll offset is applied after mount (see below)
  const isHydrating = useIsHydrating();
  const [initialScrollOffset] = useState(() =>
    isHydrating ? 0 : defaultScrollOffset
  );

  const getCellBounds = useCallback(
    (index: number) => cachedBounds.get(index),
    [cachedBounds]
  );

  const [indices, setIndices] = useState<{
    startIndexVisible: number;
    stopIndexVisible: number;
    startIndexOverscan: number;
    stopIndexOverscan: number;
  }>(() =>
    getStartStopIndicesUtil({
      cachedBounds,
      containerScrollOffset: initialScrollOffset,
      containerSize,
      itemCount,
      overscanCount
    })
  );

  // Guard against temporarily invalid indices that may occur when item count decreases
  // Cached bounds object will be re-created and a second render will restore things
  const {
    startIndexVisible,
    startIndexOverscan,
    stopIndexVisible,
    stopIndexOverscan
  } = {
    startIndexVisible: Math.min(itemCount - 1, indices.startIndexVisible),
    startIndexOverscan: Math.min(itemCount - 1, indices.startIndexOverscan),
    stopIndexVisible: Math.min(itemCount - 1, indices.stopIndexVisible),
    stopIndexOverscan: Math.min(itemCount - 1, indices.stopIndexOverscan)
  };

  const getEstimatedSize = useCallback(
    () =>
      getEstimatedSizeUtil({
        cachedBounds,
        itemCount,
        itemSize
      }),
    [cachedBounds, itemCount, itemSize]
  );

  const getStartStopIndices = useCallback(
    (scrollOffset: number) => {
      const containerScrollOffset = adjustScrollOffsetForRtl({
        containerElement,
        direction,
        isRtl,
        scrollOffset
      });

      return getStartStopIndicesUtil({
        cachedBounds,
        containerScrollOffset,
        containerSize,
        itemCount,
        overscanCount
      });
    },
    [
      cachedBounds,
      containerElement,
      containerSize,
      direction,
      isRtl,
      itemCount,
      overscanCount
    ]
  );

  // Apply the default scroll offset once, when the container first mounts with items to scroll to
  // (content can't be scrolled before then, e.g. while data is loading).
  // This effect must run before the one below that syncs indices with the current scroll offset.
  const hasAppliedDefaultScrollOffsetRef = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (
      !containerElement ||
      itemCount === 0 ||
      hasAppliedDefaultScrollOffsetRef.current
    ) {
      return;
    }

    hasAppliedDefaultScrollOffsetRef.current = true;

    if (defaultScrollOffset <= 0) {
      return;
    }

    // The isRtl prop may not have been updated yet if the direction is inherited from an ancestor
    const isRtlContainer =
      direction === "horizontal" && isRtlUtil(containerElement);

    const currentScrollOffset = adjustScrollOffsetForRtl({
      containerElement,
      direction,
      isRtl: isRtlContainer,
      scrollOffset:
        direction === "vertical"
          ? containerElement.scrollTop
          : containerElement.scrollLeft
    });
    if (currentScrollOffset !== 0) {
      // Don't override a scroll position restored by the browser (or by the user before hydration)
      return;
    }

    const scrollOffset = adjustScrollOffsetForRtl({
      containerElement,
      direction,
      isRtl: isRtlContainer,
      scrollOffset: defaultScrollOffset
    });

    if (typeof containerElement.scrollTo === "function") {
      containerElement.scrollTo({
        behavior: "instant",
        [direction === "vertical" ? "top" : "left"]: scrollOffset
      });
    } else if (direction === "vertical") {
      containerElement.scrollTop = scrollOffset;
    } else {
      containerElement.scrollLeft = scrollOffset;
    }
    // Intentionally only run when the container element mounts or items first become available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerElement, itemCount]);

  useIsomorphicLayoutEffect(() => {
    const next = containerElement
      ? getStartStopIndices(
          direction === "vertical"
            ? containerElement.scrollTop
            : containerElement.scrollLeft
        )
      : getStartStopIndicesUtil({
          cachedBounds,
          containerScrollOffset: initialScrollOffset,
          containerSize,
          itemCount,
          overscanCount
        });

    setIndices((prev) => (shallowCompare(next, prev) ? prev : next));
  }, [
    cachedBounds,
    containerElement,
    containerSize,
    direction,
    getStartStopIndices,
    initialScrollOffset,
    itemCount,
    overscanCount
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!containerElement) {
      return;
    }

    const onScroll = () => {
      setIndices((prev) => {
        const { scrollLeft, scrollTop } = containerElement;

        const scrollOffset = adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset: direction === "vertical" ? scrollTop : scrollLeft
        });

        const next = getStartStopIndicesUtil({
          cachedBounds,
          containerScrollOffset: scrollOffset,
          containerSize,
          itemCount,
          overscanCount
        });

        if (shallowCompare(next, prev)) {
          return prev;
        }

        return next;
      });
    };

    containerElement.addEventListener("scroll", onScroll);

    return () => {
      containerElement.removeEventListener("scroll", onScroll);
    };
  }, [
    cachedBounds,
    containerElement,
    containerSize,
    direction,
    isRtl,
    itemCount,
    overscanCount
  ]);

  const scrollToIndex = useStableCallback(
    ({
      align = "auto",
      containerScrollOffset,
      index
    }: {
      align?: Align;
      containerScrollOffset: number;
      index: number;
    }) => {
      let scrollOffset = getOffsetForIndex({
        align,
        cachedBounds,
        containerScrollOffset: adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset: containerScrollOffset
        }),
        containerSize,
        index,
        itemCount,
        itemSize
      });

      if (containerElement) {
        scrollOffset = adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset
        });

        if (typeof containerElement.scrollTo !== "function") {
          // Special case for environments like jsdom that don't implement scrollTo
          const next = getStartStopIndices(scrollOffset);
          if (!shallowCompare(indices, next)) {
            setIndices(next);
          }
        }

        return scrollOffset;
      }
    }
  );

  return {
    getCellBounds,
    getEstimatedSize,
    scrollToIndex,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  };
}
