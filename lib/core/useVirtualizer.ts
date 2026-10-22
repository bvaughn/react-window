import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useIsHydrating } from "../hooks/useIsHydrating";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useStableCallback } from "../hooks/useStableCallback";
import type { Align } from "../types";
import { adjustScrollOffsetForRtl } from "../utils/adjustScrollOffsetForRtl";
import { getOwnerWindow } from "../utils/getOwnerWindow";
import { getResizeObserverClass } from "../utils/getResizeObserverClass";
import { isRtl as isRtlUtil } from "../utils/isRtl";
import { observePrecedingContent } from "../utils/observePrecedingContent";
import {
  getScrollPadding,
  getScrollPosition,
  getScrollTarget,
  isSelfScrolling,
  isWindow,
  measureScrollElementViewport,
  type ScrollElement,
  type ScrollTarget
} from "../utils/scrollElement";
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
  overscanCount,
  scrollElement
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
  scrollElement?: ScrollElement | undefined;
}) {
  // Lists that scroll with an outer element (e.g. the page) render at their full size;
  // the visible region is measured relative to the outer element's viewport.
  const isScrollElementMode = scrollElement !== undefined;
  const scrollTarget = isScrollElementMode
    ? getScrollTarget(containerElement, scrollElement)
    : containerElement;

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

  // Percentage item sizes are relative to the scroll element's viewport in scroll element mode
  const [viewportSize, setViewportSize] = useState(defaultContainerSize);

  const containerSize = isScrollElementMode
    ? viewportSize
    : direction === "vertical"
      ? height
      : width;

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
  // Lists that scroll with an outer element don't control its initial scroll position
  const [initialScrollOffset] = useState(() =>
    isHydrating || isScrollElementMode ? 0 : defaultScrollOffset
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
      isScrollElementMode ||
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
    if (isScrollElementMode && containerElement && scrollTarget) {
      // Measured after every render (see below)
      return;
    }

    const next =
      containerElement && !isScrollElementMode
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
    isScrollElementMode,
    itemCount,
    overscanCount,
    scrollTarget
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!containerElement || isScrollElementMode) {
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
    isScrollElementMode,
    itemCount,
    overscanCount
  ]);

  const updateIndicesFromScrollElement = useStableCallback(() => {
    if (!containerElement || !scrollTarget) {
      return;
    }

    const { offset, size, viewportSize } = measureScrollElementViewport({
      containerElement,
      direction,
      isRtl,
      scrollTarget
    });

    setViewportSize(viewportSize);

    const next = getStartStopIndicesUtil({
      cachedBounds,
      containerScrollOffset: offset,
      containerSize: size,
      itemCount,
      overscanCount
    });

    setIndices((prev) => (shallowCompare(next, prev) ? prev : next));
  });

  // The container's position within the scroll element can change whenever anything renders,
  // so measure it after every render (state updates are skipped if nothing has changed)
  useIsomorphicLayoutEffect(() => {
    if (isScrollElementMode) {
      updateIndicesFromScrollElement();
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (!isScrollElementMode || !containerElement || !scrollTarget) {
      return;
    }

    const ownerWindow = getOwnerWindow(containerElement);
    const onChange = () => updateIndicesFromScrollElement();

    scrollTarget.addEventListener("scroll", onChange, { passive: true });
    // The container may also scroll its own content (e.g. a grid's columns)
    containerElement.addEventListener("scroll", onChange, { passive: true });
    ownerWindow.addEventListener("resize", onChange);

    // The scroll element's viewport may resize without the window resizing
    let resizeObserver: ResizeObserver | undefined = undefined;
    const ResizeObserverClass = getResizeObserverClass(containerElement);
    if (ResizeObserverClass && !isWindow(scrollTarget)) {
      resizeObserver = new ResizeObserverClass(onChange);
      resizeObserver.observe(scrollTarget);
    }

    // Content before the container may move it without a scroll or render (e.g. an image loading above it)
    const stopObservingPrecedingContent = observePrecedingContent({
      container: isWindow(scrollTarget)
        ? scrollTarget.document.documentElement
        : scrollTarget,
      element: containerElement,
      onChange
    });

    return () => {
      scrollTarget.removeEventListener("scroll", onChange);
      containerElement.removeEventListener("scroll", onChange);
      ownerWindow.removeEventListener("resize", onChange);
      resizeObserver?.disconnect();
      stopObservingPrecedingContent();
    };
  }, [
    containerElement,
    isScrollElementMode,
    scrollTarget,
    updateIndicesFromScrollElement
  ]);

  /**
   * Determines the scroll position that brings an item into view, and which element must be scrolled to reach it:
   * the container itself or (in scroll element mode) the scroll element.
   *
   * @throws RangeError if an invalid index is provided
   */
  const getScrollPositionForIndex = useStableCallback(
    ({
      align = "auto",
      index
    }: {
      align?: Align;
      index: number;
    }): { scrollOffset: number; scrollTarget: ScrollTarget } | undefined => {
      // Like the browser's scrollIntoView, respect the scrolled element's CSS scroll-padding
      // (e.g. so that items aren't aligned underneath a sticky header)
      const getOffset = ({
        clamp,
        containerScrollOffset,
        containerSize,
        padding
      }: {
        clamp: boolean;
        containerScrollOffset: number;
        containerSize: number;
        padding: { end: number; start: number };
      }) => {
        if (padding.start === 0 && padding.end === 0) {
          return getOffsetForIndex({
            align,
            cachedBounds,
            clamp,
            containerScrollOffset,
            containerSize,
            index,
            itemCount,
            itemSize
          });
        }

        // Align the item within the padded region of the viewport, then convert back to a scroll offset
        const offset =
          getOffsetForIndex({
            align,
            cachedBounds,
            clamp: false,
            containerScrollOffset: containerScrollOffset + padding.start,
            containerSize: Math.max(
              0,
              containerSize - padding.start - padding.end
            ),
            index,
            itemCount,
            itemSize
          }) - padding.start;

        return clamp
          ? Math.max(0, Math.min(getEstimatedSize() - containerSize, offset))
          : offset;
      };

      if (
        isScrollElementMode &&
        containerElement &&
        scrollTarget &&
        !isSelfScrolling(containerElement, direction)
      ) {
        const { viewportOffset, viewportSize } = measureScrollElementViewport({
          containerElement,
          direction,
          isRtl,
          scrollTarget
        });

        // The viewport can show content before or after the container,
        // so the browser (rather than the container's own size) limits how far it scrolls
        const offset = getOffset({
          clamp: false,
          containerScrollOffset: viewportOffset,
          containerSize: viewportSize,
          padding: getScrollPadding({
            direction,
            isRtl,
            scrollTarget,
            viewportSize
          })
        });

        // Horizontal RTL offsets increase leftward, but scroll positions increase rightward (in modern browsers)
        const delta = offset - viewportOffset;
        const scrollDelta =
          direction === "horizontal" && isRtl ? -delta : delta;

        return {
          scrollOffset:
            getScrollPosition(scrollTarget, direction) + scrollDelta,
          scrollTarget
        };
      }

      const containerScrollOffset = containerElement
        ? direction === "vertical"
          ? containerElement.scrollTop
          : containerElement.scrollLeft
        : 0;

      const ownContainerSize =
        isScrollElementMode && containerElement
          ? direction === "vertical"
            ? containerElement.clientHeight
            : containerElement.clientWidth
          : containerSize;

      let scrollOffset = getOffset({
        clamp: true,
        containerScrollOffset: adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset: containerScrollOffset
        }),
        containerSize: ownContainerSize,
        padding: containerElement
          ? getScrollPadding({
              direction,
              isRtl,
              scrollTarget: containerElement,
              viewportSize: ownContainerSize
            })
          : { end: 0, start: 0 }
      });

      if (containerElement && (!isScrollElementMode || scrollTarget)) {
        scrollOffset = adjustScrollOffsetForRtl({
          containerElement,
          direction,
          isRtl,
          scrollOffset
        });

        if (
          !isScrollElementMode &&
          typeof containerElement.scrollTo !== "function"
        ) {
          // Special case for environments like jsdom that don't implement scrollTo
          const next = getStartStopIndices(scrollOffset);
          if (!shallowCompare(indices, next)) {
            setIndices(next);
          }
        }

        return { scrollOffset, scrollTarget: containerElement };
      }
    }
  );

  return {
    getCellBounds,
    getEstimatedSize,
    getScrollPositionForIndex,
    scrollTarget,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  };
}
