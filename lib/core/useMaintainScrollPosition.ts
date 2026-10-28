import { useMemo, useRef, useState, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useStableCallback } from "../hooks/useStableCallback";
import {
  getScrollPosition,
  measureScrollElementViewport,
  scrollTargetTo,
  type ScrollTarget
} from "../utils/scrollElement";
import { getEstimatedSize as getEstimatedSizeUtil } from "./getEstimatedSize";
import { getStartStopIndices as getStartStopIndicesUtil } from "./getStartStopIndices";
import type { CachedBounds, Direction, SizeFunction } from "./types";
import type { PendingScroll } from "./useScrollToIndex";

// Long enough for the item to be re-rendered and measured (or for a short CSS transition)
const DEFAULT_ANCHOR_DURATION = 1000;

// Momentum scrolling reports scroll events every frame until it stops
const TOUCH_SCROLL_IDLE_DURATION = 150;

// In case the end of a touch is never reported (e.g. touches that are interrupted by the browser)
const TOUCH_SCROLL_MAX_IDLE_DURATION = 5000;

/**
 * Bounds with every item's offset shifted by the specified amount.
 *
 * @internal Exported for testing
 */
export function shiftCachedBounds(
  cachedBounds: CachedBounds,
  shift: number
): CachedBounds {
  if (shift === 0) {
    return cachedBounds;
  }

  return {
    itemSize: cachedBounds.itemSize,
    get(index) {
      const bounds = cachedBounds.get(index);
      return { ...bounds, scrollOffset: bounds.scrollOffset - shift };
    },
    set(index, bounds) {
      cachedBounds.set(index, {
        ...bounds,
        scrollOffset: bounds.scrollOffset + shift
      });
    },
    get size() {
      return cachedBounds.size;
    }
  };
}

/**
 * First item in the range that didn't change size (or the first item, if they all did).
 */
function findUnchangedItem({
  cachedBounds,
  prevCachedBounds,
  startIndex,
  stopIndex
}: {
  cachedBounds: CachedBounds;
  prevCachedBounds: CachedBounds;
  startIndex: number;
  stopIndex: number;
}) {
  for (let index = startIndex; index <= stopIndex; index++) {
    if (cachedBounds.get(index).size === prevCachedBounds.get(index).size) {
      return index;
    }
  }
  return startIndex;
}

/**
 * When item sizes change (e.g. rows are measured), keeps a visible item where it was on screen;
 * otherwise items before it that grow or shrink would move everything after them.
 *
 * The anchor is the first visible item that didn't change size, so that items revealed by scrolling
 * (which are measured once they're visible) move out of the way of the content that was already in view.
 * Corrections are made in the same commit that moves the items, so no frame shows them out of place.
 *
 * While the user is touch scrolling, iOS ignores (or fights) changes to the scroll position,
 * so corrections are applied by shifting the items instead (the returned bounds are shifted by the deviation);
 * the shift is replaced by a change in scroll position once scrolling has stopped.
 * The content's size is reduced by the shift too, so in scroll element mode
 * (where the container renders at its full size) content after the list also moves while the items are shifted.
 *
 * ⚠️ This hook's effects must run before the ones that sync indices with the current scroll offset.
 */
export function useMaintainScrollPosition<Props extends object>({
  containerElement,
  direction,
  enabled,
  isRtl,
  isScrollElementMode,
  itemCount,
  itemSize,
  pendingScroll,
  rawCachedBounds,
  scrollTarget
}: {
  containerElement: HTMLElement | null;
  direction: Direction;
  enabled: boolean;
  isRtl: boolean;
  isScrollElementMode: boolean;
  itemCount: number;
  itemSize: number | SizeFunction<Props>;
  pendingScroll: RefObject<PendingScroll | null> | undefined;
  rawCachedBounds: CachedBounds;
  scrollTarget: ScrollTarget | null;
}) {
  // The ref is the source of truth (it's updated before each state update); state triggers the re-render
  const [deviation, setDeviation] = useState(0);
  const deviationRef = useRef(0);

  const cachedBounds = useMemo(
    () => shiftCachedBounds(rawCachedBounds, deviation),
    [deviation, rawCachedBounds]
  );

  const prevStateRef = useRef<{
    cachedBounds: CachedBounds;
    itemCount: number;
  } | null>(null);
  const touchScrollRef = useRef<{
    isTouching: boolean;
    isTouchScrolling: boolean;
    timeout: ReturnType<typeof setTimeout> | undefined;
  }>({ isTouching: false, isTouchScrolling: false, timeout: undefined });
  // A shift that was just replaced by a change in scroll position
  const pendingDeviationRef = useRef(0);
  // An item that the caller asked to anchor (e.g. one the user is expanding)
  const requestedAnchorRef = useRef<{ deadline: number; index: number } | null>(
    null
  );

  useIsomorphicLayoutEffect(() => {
    const prevState = prevStateRef.current;
    prevStateRef.current = { cachedBounds: rawCachedBounds, itemCount };

    let requestedAnchorIndex: number | undefined = undefined;
    if (requestedAnchorRef.current !== null) {
      if (performance.now() < requestedAnchorRef.current.deadline) {
        requestedAnchorIndex = requestedAnchorRef.current.index;
      } else {
        requestedAnchorRef.current = null;
      }
    }

    if (
      !enabled ||
      direction !== "vertical" ||
      !containerElement ||
      prevState === null ||
      prevState.cachedBounds === rawCachedBounds ||
      prevState.itemCount === 0 ||
      itemCount === 0 ||
      typeof itemSize !== "function" ||
      // scrollToRow positions the target itself (and corrects for measurements as they arrive)
      pendingScroll?.current
    ) {
      return;
    }

    let scrollOffset: number;
    let viewportEnd: number;
    let target: ScrollTarget;
    if (isScrollElementMode) {
      if (!scrollTarget) {
        return;
      }

      // The container's position within the scroll element hasn't changed yet
      const { offset, viewportOffset, viewportSize } =
        measureScrollElementViewport({
          containerElement,
          direction,
          isRtl,
          scrollTarget
        });
      scrollOffset = offset;
      viewportEnd = viewportOffset + viewportSize;
      target = scrollTarget;
    } else {
      scrollOffset = containerElement.scrollTop;
      viewportEnd = scrollOffset + containerElement.clientHeight;
      target = containerElement;
    }

    // Items are rendered shifted by the deviation; corrections are based on unshifted offsets
    scrollOffset += deviationRef.current;
    viewportEnd += deviationRef.current;

    const { startIndexVisible, stopIndexVisible } = getStartStopIndicesUtil({
      cachedBounds: prevState.cachedBounds,
      containerScrollOffset: scrollOffset,
      containerSize: viewportEnd - scrollOffset,
      itemCount: prevState.itemCount,
      overscanCount: 0
    });

    let anchorIndex: number;
    if (
      requestedAnchorIndex !== undefined &&
      requestedAnchorIndex >= startIndexVisible &&
      requestedAnchorIndex <= stopIndexVisible &&
      requestedAnchorIndex < itemCount
    ) {
      anchorIndex = requestedAnchorIndex;
    } else {
      // Lists scrolled to the end (e.g. pinned to the bottom) are left for the caller to manage
      const prevSize = getEstimatedSizeUtil({
        cachedBounds: prevState.cachedBounds,
        itemCount: prevState.itemCount,
        itemSize
      });
      if (
        scrollOffset <= 0 ||
        viewportEnd >= prevSize - 1 ||
        startIndexVisible >= itemCount
      ) {
        return;
      }

      anchorIndex = findUnchangedItem({
        cachedBounds: rawCachedBounds,
        prevCachedBounds: prevState.cachedBounds,
        startIndex: startIndexVisible,
        stopIndex: Math.min(stopIndexVisible, itemCount - 1)
      });
    }

    const delta =
      rawCachedBounds.get(anchorIndex).scrollOffset -
      prevState.cachedBounds.get(anchorIndex).scrollOffset;
    if (delta !== 0) {
      if (touchScrollRef.current.isTouchScrolling) {
        deviationRef.current += delta;
        setDeviation(deviationRef.current);
      } else {
        scrollTargetTo(target, {
          behavior: "instant",
          top: getScrollPosition(target, direction) + delta
        });
      }
    }
    // Intentionally only run when item sizes (or count) change; other values are read from the latest render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCachedBounds]);

  // Replace the shift with a change in scroll position, in the same commit that removes it.
  // (A shift that's negative can't always be replaced near the top of the list, since the browser
  // clamps the scroll position at 0; the items then move by the remainder.)
  useIsomorphicLayoutEffect(() => {
    const pendingDeviation = pendingDeviationRef.current;
    pendingDeviationRef.current = 0;

    const target = isScrollElementMode ? scrollTarget : containerElement;
    if (pendingDeviation !== 0 && target) {
      scrollTargetTo(target, {
        behavior: "instant",
        top: getScrollPosition(target, direction) + pendingDeviation
      });
    }
    // Intentionally only run when the shift changes; other values are read from the latest render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviation]);

  // Track touch scrolling (including momentum after the finger lifts)
  useIsomorphicLayoutEffect(() => {
    const target = isScrollElementMode ? scrollTarget : containerElement;
    if (!enabled || direction !== "vertical" || !target) {
      return;
    }

    const touchScroll = touchScrollRef.current;

    // Elements that were touched (see onTouchStart)
    const touchTargets = new Map<EventTarget, (event: Event) => void>();
    const removeTouchTarget = (touchTarget: EventTarget) => {
      const listener = touchTargets.get(touchTarget);
      if (listener) {
        touchTarget.removeEventListener("touchend", listener);
        touchTarget.removeEventListener("touchcancel", listener);
        touchTargets.delete(touchTarget);
      }
    };

    const endTouchScroll = () => {
      clearTimeout(touchScroll.timeout);
      touchScroll.isTouching = false;
      touchScroll.isTouchScrolling = false;
      if (deviationRef.current !== 0) {
        pendingDeviationRef.current = deviationRef.current;
        deviationRef.current = 0;
        setDeviation(0);
      }
    };
    const onIdle = () => {
      if (pendingScroll?.current) {
        // scrollToRow owns the scroll position (and its animation is based on the current shift)
        scheduleIdle();
      } else {
        endTouchScroll();
      }
    };
    const scheduleIdle = () => {
      clearTimeout(touchScroll.timeout);
      touchScroll.timeout = setTimeout(
        onIdle,
        touchScroll.isTouching
          ? TOUCH_SCROLL_MAX_IDLE_DURATION
          : TOUCH_SCROLL_IDLE_DURATION
      );
    };

    const isTouchRemaining = (event: Event) =>
      (event as TouchEvent).touches?.length > 0;

    const onTouchEnd = (event: Event) => {
      if (isTouchRemaining(event)) {
        // Other fingers are still touching
        return;
      }
      touchScroll.isTouching = false;
      scheduleIdle();
    };
    const onTouchStart = (event: Event) => {
      touchScroll.isTouching = true;
      touchScroll.isTouchScrolling = true;
      scheduleIdle();

      // Touch events keep targeting the element the touch started on, even if it unmounts
      // (e.g. a row that's scrolled out of view), and events on a detached element don't bubble
      const touchTarget = event.target;
      if (
        touchTarget &&
        touchTarget !== target &&
        !touchTargets.has(touchTarget)
      ) {
        const onTargetTouchEnd = (event: Event) => {
          if (isTouchRemaining(event)) {
            return;
          }
          removeTouchTarget(touchTarget);
          if (!(touchTarget as Node).isConnected) {
            onTouchEnd(event);
          }
        };
        touchTargets.set(touchTarget, onTargetTouchEnd);
        touchTarget.addEventListener("touchend", onTargetTouchEnd, {
          passive: true
        });
        touchTarget.addEventListener("touchcancel", onTargetTouchEnd, {
          passive: true
        });
      }
    };
    const onScroll = () => {
      if (touchScroll.isTouchScrolling) {
        scheduleIdle();
      }
    };
    // Where supported, a more direct signal that momentum scrolling has stopped
    const onScrollEnd = () => {
      if (touchScroll.isTouchScrolling && !touchScroll.isTouching) {
        clearTimeout(touchScroll.timeout);
        onIdle();
      }
    };

    target.addEventListener("touchstart", onTouchStart, { passive: true });
    target.addEventListener("touchend", onTouchEnd, { passive: true });
    target.addEventListener("touchcancel", onTouchEnd, { passive: true });
    target.addEventListener("scroll", onScroll, { passive: true });
    target.addEventListener("scrollend", onScrollEnd, { passive: true });

    return () => {
      target.removeEventListener("touchstart", onTouchStart);
      target.removeEventListener("touchend", onTouchEnd);
      target.removeEventListener("touchcancel", onTouchEnd);
      target.removeEventListener("scroll", onScroll);
      target.removeEventListener("scrollend", onScrollEnd);
      Array.from(touchTargets.keys()).forEach(removeTouchTarget);

      endTouchScroll();
    };
  }, [
    containerElement,
    direction,
    enabled,
    isScrollElementMode,
    pendingScroll,
    scrollTarget
  ]);

  /**
   * Keeps an item where it is on screen through changes in item sizes for the specified duration (in milliseconds),
   * in place of the first visible item that didn't change size.
   *
   * @throws RangeError if an invalid index is provided
   */
  const anchorItem = useStableCallback(
    ({
      duration = DEFAULT_ANCHOR_DURATION,
      index
    }: {
      duration?: number;
      index: number;
    }) => {
      if (index < 0 || index >= itemCount) {
        throw RangeError(`Invalid index specified: ${index}`, {
          cause: `Index ${index} is not within the range of 0 - ${itemCount - 1}`
        });
      }

      requestedAnchorRef.current = {
        deadline: performance.now() + duration,
        index
      };
    }
  );

  return { anchorItem, cachedBounds, deviation };
}
