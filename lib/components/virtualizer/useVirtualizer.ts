import { useCallback, useEffect, useMemo, useRef } from "react";
import { getItemIndex } from "../../core/itemIndex";
import { useIsRtl } from "../../core/useIsRtl";
import { useScrollToIndex } from "../../core/useScrollToIndex";
import { useVirtualizer as useVirtualizerCore } from "../../core/useVirtualizer";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { assert } from "../../utils/assert";
import { isDynamicRowHeight } from "../list/isDynamicRowHeight";
import type { DynamicRowHeight } from "../list/types";
import type { VirtualItem, Virtualizer, VirtualizerOptions } from "./types";

// Sizes are cached based on the identity of the itemSize option
const ITEM_PROPS = {};

/**
 * Calculates which items to render, and where, for custom (headless) virtualized content
 * (e.g. a `<table>` or a custom layout).
 *
 * The returned items are positioned relative to the start of the element's content;
 * how they are rendered (e.g. absolute positioning or spacer elements) is up to the caller.
 */
export function useVirtualizer({
  count,
  defaultScrollOffset = 0,
  defaultSize = 0,
  dir,
  direction = "vertical",
  element,
  itemSize: itemSizeOption,
  onItemsRendered,
  overscanCount = 3,
  scrollElement
}: VirtualizerOptions): Virtualizer {
  const isDynamicSize = isDynamicRowHeight(itemSizeOption);
  assert(
    !isDynamicSize || direction === "vertical",
    "Dynamic item sizes are only supported for vertical content"
  );

  const itemSize = useMemo(() => {
    if (isDynamicRowHeight(itemSizeOption)) {
      return (index: number) =>
        itemSizeOption.getRowHeight(index) ??
        itemSizeOption.getAverageRowHeight();
    }

    return itemSizeOption;
  }, [itemSizeOption]);

  const isRtl = useIsRtl(element, dir);

  const {
    getCellBounds,
    getEstimatedSize,
    scrollTarget,
    getScrollPositionForIndex,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  } = useVirtualizerCore({
    containerElement: element,
    defaultContainerSize: defaultSize,
    defaultScrollOffset,
    direction,
    isRtl: direction === "horizontal" && isRtl,
    itemCount: count,
    itemProps: ITEM_PROPS,
    itemSize,
    onResize: undefined,
    overscanCount,
    scrollElement
  });

  // Elements passed to measureElement; React 18 doesn't say which element unmounted (it passes null),
  // so disconnected elements are pruned after each render instead
  const measuredElementsRef = useRef(new Set<Element>());
  const warnedElementsRef = useRef(new WeakSet<Element>());
  const itemElementsRef = useRef<Element[]>([]);
  const observedRef = useRef<{
    dynamicRowHeight: DynamicRowHeight | null;
    unobserve: Map<Element, () => void>;
  }>({ dynamicRowHeight: null, unobserve: new Map() });

  const measureElement = useCallback((element: Element | null) => {
    if (element !== null) {
      measuredElementsRef.current.add(element);
    }
  }, []);

  const container = element;
  useIsomorphicLayoutEffect(() => {
    const elements = measuredElementsRef.current;
    const observed = observedRef.current;

    const dynamicRowHeight = isDynamicRowHeight(itemSizeOption)
      ? itemSizeOption
      : null;
    if (
      observed.dynamicRowHeight?.observeRowElements !==
      dynamicRowHeight?.observeRowElements
    ) {
      // A different cache (or none) is being used
      observed.unobserve.forEach((unobserve) => unobserve());
      observed.unobserve.clear();
    }
    observed.dynamicRowHeight = dynamicRowHeight;

    elements.forEach((element) => {
      if (!element.isConnected) {
        elements.delete(element);
        observed.unobserve.get(element)?.();
        observed.unobserve.delete(element);
      } else if (
        dynamicRowHeight &&
        // Like List, measure items once the element has mounted
        // (e.g. so the dynamic row height cache has finished mounting too)
        container !== null &&
        !observed.unobserve.has(element)
      ) {
        if (getItemIndex(element) === undefined) {
          // Measurements can't be associated with an item without its index
          if (!warnedElementsRef.current.has(element)) {
            warnedElementsRef.current.add(element);
            console.warn(
              "useVirtualizer: Items passed to measureElement must specify their index with a data-index attribute",
              element
            );
          }
          return;
        }

        observed.unobserve.set(
          element,
          dynamicRowHeight.observeRowElements([element])
        );
      }
    });

    itemElementsRef.current = Array.from(elements);
  });

  useEffect(() => {
    const observed = observedRef.current;
    return () => {
      observed.unobserve.forEach((unobserve) => unobserve());
      observed.unobserve.clear();
      observed.dynamicRowHeight = null;
    };
  }, []);

  const scrollToIndex = useScrollToIndex({
    direction,
    element,
    getCellBounds,
    isDynamicSize,
    itemCount: count,
    itemElements: itemElementsRef,
    scrollTarget,
    getScrollPositionForIndex
  });

  useEffect(() => {
    if (startIndexOverscan >= 0 && stopIndexOverscan >= 0 && onItemsRendered) {
      onItemsRendered(
        { startIndex: startIndexVisible, stopIndex: stopIndexVisible },
        { startIndex: startIndexOverscan, stopIndex: stopIndexOverscan }
      );
    }
  }, [
    onItemsRendered,
    startIndexOverscan,
    startIndexVisible,
    stopIndexOverscan,
    stopIndexVisible
  ]);

  const items = useMemo(() => {
    const items: VirtualItem[] = [];
    if (count > 0) {
      for (
        let index = startIndexOverscan;
        index <= stopIndexOverscan;
        index++
      ) {
        const { scrollOffset, size } = getCellBounds(index);
        items.push({ index, offset: scrollOffset, size });
      }
    }
    return items;
  }, [count, getCellBounds, startIndexOverscan, stopIndexOverscan]);

  const totalSize = getEstimatedSize();

  return useMemo(
    () => ({
      items,
      measureElement,
      scrollToIndex,
      totalSize,
      visibleRange: {
        startIndex: startIndexVisible,
        stopIndex: stopIndexVisible
      }
    }),
    [
      items,
      measureElement,
      scrollToIndex,
      startIndexVisible,
      stopIndexVisible,
      totalSize
    ]
  );
}
