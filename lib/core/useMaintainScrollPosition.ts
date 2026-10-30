import {
  useMemo,
  useReducer,
  useRef,
  useState,
  type Key,
  type RefObject
} from "react";
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

// How far beyond the change in item count to search for an item that may have moved (see findIndexByKey)
const MAX_KEY_SEARCH_DISTANCE = 1000;

// How many times to re-render to finish a correction the content wasn't large enough for (see scrollBy)
const MAX_CORRECTION_RENDERS = 2;

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
 * Current index of the item with the specified key, or undefined if it was removed.
 *
 * Items inserted or removed before an item move it by (up to) the change in item count,
 * so the search starts at its previous index and works outward (in the direction it likely moved first);
 * items may also have been inserted and removed at once (e.g. older items loaded and newer ones dropped),
 * so the search continues a bit beyond that.
 * (This is a fast path; see findAnchor for items that moved farther.)
 */
export function findIndexByKey({
  getItemKey,
  itemCount,
  key,
  prevIndex,
  prevItemCount
}: {
  getItemKey: (index: number) => Key;
  itemCount: number;
  key: Key;
  prevIndex: number;
  prevItemCount: number;
}): number | undefined {
  const countDelta = itemCount - prevItemCount;
  const step = countDelta < 0 ? -1 : 1;
  const maxDistance = Math.abs(countDelta) + MAX_KEY_SEARCH_DISTANCE;

  for (let distance = 0; distance <= maxDistance; distance++) {
    const index = prevIndex + distance * step;
    if (index >= 0 && index < itemCount && getItemKey(index) === key) {
      return index;
    }

    const oppositeIndex = prevIndex - distance * step;
    if (
      distance > 0 &&
      oppositeIndex >= 0 &&
      oppositeIndex < itemCount &&
      getItemKey(oppositeIndex) === key
    ) {
      return oppositeIndex;
    }
  }

  return undefined;
}

type Anchor = { index: number; isRequested: boolean; prevIndex: number };

/**
 * The item to keep in place when item sizes (or items) change, and where it was before the change;
 * or undefined if none of the visible items can be found again.
 *
 * This is the requested item (if it's visible), otherwise the first visible item that didn't change size,
 * otherwise the first visible item that still exists.
 * With item keys, items are found again (by key) after items are inserted or removed before them.
 *
 * Also returns the requested item's current index if it was visible (undefined if it was removed),
 * so that the request can follow it (or be cancelled).
 */
export function findAnchor({
  cachedBounds,
  getItemKey,
  itemCount,
  prevCachedBounds,
  prevItemCount,
  renderedKeys,
  requestedIndex,
  startIndexVisible,
  stopIndexVisible
}: {
  cachedBounds: CachedBounds;
  getItemKey: ((index: number) => Key) | undefined;
  itemCount: number;
  prevCachedBounds: CachedBounds;
  prevItemCount: number;
  // Keys of the items rendered before the change (by their previous index)
  renderedKeys: ReadonlyMap<number, Key>;
  requestedIndex: number | undefined;
  startIndexVisible: number;
  stopIndexVisible: number;
}): {
  anchor: Anchor | undefined;
  requested: { index: number | undefined } | undefined;
} {
  // Built (once) for items that aren't found near their previous index, e.g. if they moved a long way
  let indicesByKey: Map<Key, number> | undefined = undefined;
  const getIndexFromMap = (getItemKey: (index: number) => Key, key: Key) => {
    if (indicesByKey === undefined) {
      indicesByKey = new Map();
      for (let index = 0; index < itemCount; index++) {
        const itemKey = getItemKey(index);
        if (!indicesByKey.has(itemKey)) {
          indicesByKey.set(itemKey, index);
        }
      }
    }
    return indicesByKey.get(key);
  };

  const getIndex = (prevIndex: number, canSearchAllItems: boolean) => {
    if (getItemKey === undefined) {
      return prevIndex < itemCount ? prevIndex : undefined;
    }

    // Items that weren't rendered can't be found again (and may have moved)
    const key = renderedKeys.get(prevIndex);
    if (key === undefined) {
      return undefined;
    }

    const index = findIndexByKey({
      getItemKey,
      itemCount,
      key,
      prevIndex,
      prevItemCount
    });
    return index === undefined && canSearchAllItems
      ? getIndexFromMap(getItemKey, key)
      : index;
  };

  let requested: { index: number | undefined } | undefined = undefined;
  if (
    requestedIndex !== undefined &&
    requestedIndex >= startIndexVisible &&
    requestedIndex <= stopIndexVisible
  ) {
    // The caller asked for this item specifically, so it's worth searching every item for
    const index = getIndex(requestedIndex, true);
    requested = { index };
    if (index !== undefined) {
      return {
        anchor: { index, isRequested: true, prevIndex: requestedIndex },
        requested
      };
    }
  }

  const findVisibleAnchor = (canSearchAllItems: boolean) => {
    let anchor: Anchor | undefined = undefined;
    for (
      let prevIndex = startIndexVisible;
      prevIndex <= stopIndexVisible;
      prevIndex++
    ) {
      const index = getIndex(prevIndex, canSearchAllItems);
      if (index === undefined) {
        continue;
      }

      anchor ??= { index, isRequested: false, prevIndex };
      if (
        cachedBounds.get(index).size === prevCachedBounds.get(prevIndex).size
      ) {
        return { index, isRequested: false, prevIndex };
      }
    }
    return anchor;
  };

  // Searching every item is only needed if none of the visible items are found nearby
  // (e.g. a large batch was inserted and as many removed); keeping any visible item in place looks the same
  const anchor =
    findVisibleAnchor(false) ??
    (getItemKey !== undefined ? findVisibleAnchor(true) : undefined);

  return { anchor, requested };
}

/**
 * When item sizes change (e.g. rows are measured), keeps a visible item where it was on screen;
 * otherwise items before it that grow or shrink would move everything after them.
 *
 * The anchor is the first visible item that didn't change size, so that items revealed by scrolling
 * (which are measured once they're visible) move out of the way of the content that was already in view.
 * Corrections are made in the same commit that moves the items, so no frame shows them out of place.
 *
 * With item keys, the anchor is found again (by its key) after items are inserted or removed before it,
 * and the view is kept in place even at the start or end of the content (e.g. when older messages are loaded).
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
  getItemKey,
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
  getItemKey: ((index: number) => Key) | undefined;
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
  // Keys of the items rendered by the previous commit (see recordRenderedKeys)
  const renderedKeysRef = useRef<Map<number, Key>>(new Map());

  // Part of a correction that the content wasn't large enough for (see scrollBy)
  const remainingCorrectionRef = useRef<{
    delta: number;
    renders: number;
  } | null>(null);
  // Incremented to re-render (so that the indices of the items to render are synced with the corrected scroll position)
  const hasWarnedRef = useRef(false);
  const [correctionRenderCount, forceRender] = useReducer(
    (count: number) => count + 1,
    0
  );

  /**
   * Adjusts the scroll position by the specified amount.
   *
   * The content's size is estimated from the items measured so far, so after items are inserted before the ones
   * in view (but before the newly visible items have been rendered) it may be too small to scroll far enough;
   * the rest of the correction is made after re-rendering (before the browser paints).
   */
  const scrollBy = (target: ScrollTarget, delta: number, renders = 0) => {
    const top = getScrollPosition(target, direction) + delta;
    scrollTargetTo(target, { behavior: "instant", top });

    // Re-rendering can make the content larger (but the scroll position can't go below 0)
    const remainingDelta = top - getScrollPosition(target, direction);
    if (remainingDelta >= 1 && renders < MAX_CORRECTION_RENDERS) {
      remainingCorrectionRef.current = {
        delta: remainingDelta,
        renders: renders + 1
      };
      forceRender();
    } else {
      if (remainingDelta >= 1 && !hasWarnedRef.current) {
        // Corrections usually fall short again until more items are measured, so only warn once
        hasWarnedRef.current = true;
        console.warn(
          `react-window: Items could not be kept in place; the content was ${Math.round(remainingDelta)}px too small`
        );
      }
      remainingCorrectionRef.current = null;
    }
  };

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

    const { anchor, requested } = findAnchor({
      cachedBounds: rawCachedBounds,
      getItemKey,
      itemCount,
      prevCachedBounds: prevState.cachedBounds,
      prevItemCount: prevState.itemCount,
      renderedKeys: renderedKeysRef.current,
      requestedIndex: requestedAnchorIndex,
      startIndexVisible,
      stopIndexVisible
    });
    if (requested !== undefined && requestedAnchorRef.current !== null) {
      if (requested.index === undefined) {
        // The requested item was removed
        requestedAnchorRef.current = null;
      } else {
        // The requested item may have moved (if items were inserted or removed before it)
        requestedAnchorRef.current.index = requested.index;
      }
    }

    if (anchor === undefined) {
      return;
    }

    if (!anchor.isRequested && anchor.index === anchor.prevIndex) {
      // Lists scrolled to the end (e.g. pinned to the bottom) are left for the caller to manage
      const prevSize = getEstimatedSizeUtil({
        cachedBounds: prevState.cachedBounds,
        itemCount: prevState.itemCount,
        itemSize
      });
      if (scrollOffset <= 0 || viewportEnd >= prevSize - 1) {
        return;
      }
    }

    if (anchor.index !== anchor.prevIndex && prevState.cachedBounds.size > 0) {
      // Items were inserted or removed before the anchor; the content's size is estimated from the items measured
      // so far, so measure as many as before (so that the content is large enough to stay in place, see scrollBy)
      rawCachedBounds.get(
        Math.min(
          itemCount - 1,
          prevState.cachedBounds.size - 1 + anchor.index - anchor.prevIndex
        )
      );
    }

    const delta =
      rawCachedBounds.get(anchor.index).scrollOffset -
      prevState.cachedBounds.get(anchor.prevIndex).scrollOffset;
    if (delta !== 0) {
      if (touchScrollRef.current.isTouchScrolling) {
        deviationRef.current += delta;
        setDeviation(deviationRef.current);
      } else {
        scrollBy(target, delta);
      }
    }
    // Intentionally only run when item sizes (or count) change; other values are read from the latest render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCachedBounds]);

  // Finish a correction once the content has been re-rendered (see scrollBy)
  useIsomorphicLayoutEffect(() => {
    const remainingCorrection = remainingCorrectionRef.current;
    const target = isScrollElementMode ? scrollTarget : containerElement;
    if (remainingCorrection !== null && target) {
      scrollBy(target, remainingCorrection.delta, remainingCorrection.renders);
    }
  });

  // Replace the shift with a change in scroll position, in the same commit that removes it.
  // (A shift that's negative can't always be replaced near the top of the list, since the browser
  // clamps the scroll position at 0; the items then move by the remainder.)
  useIsomorphicLayoutEffect(() => {
    const pendingDeviation = pendingDeviationRef.current;
    pendingDeviationRef.current = 0;

    const target = isScrollElementMode ? scrollTarget : containerElement;
    if (pendingDeviation !== 0 && target) {
      scrollBy(target, pendingDeviation);
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

  /**
   * Records the keys of the rendered items, so that they can be found again (in the next commit)
   * if items are inserted or removed before them.
   *
   * ⚠️ Must be called (in a layout effect) after this hook's effects, every commit.
   */
  const recordRenderedKeys = (startIndex: number, stopIndex: number) => {
    const keys = new Map<number, Key>();
    if (enabled && getItemKey !== undefined && startIndex >= 0) {
      for (let index = startIndex; index <= stopIndex; index++) {
        keys.set(index, getItemKey(index));
      }
    }
    renderedKeysRef.current = keys;
  };

  return {
    anchorItem,
    cachedBounds,
    correctionRenderCount,
    deviation,
    recordRenderedKeys
  };
}
