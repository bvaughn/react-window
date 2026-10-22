import type { Direction } from "../core/types";
import { adjustScrollOffsetForRtl } from "./adjustScrollOffsetForRtl";
import { getOwnerWindow } from "./getOwnerWindow";

/**
 * Element that scrolls a list or grid, if not the list or grid itself:
 * - "window" to scroll with the page
 * - an ancestor element that scrolls (or null until it has mounted)
 */
export type ScrollElement = "window" | HTMLElement | null;

export type ScrollTarget = HTMLElement | Window;

export function isWindow(target: ScrollTarget): target is Window {
  return (target as Window).window === target;
}

export function getScrollTarget(
  containerElement: HTMLElement | null,
  scrollElement: ScrollElement | undefined
): ScrollTarget | null {
  if (scrollElement === "window") {
    // Use the container's own window (e.g. a popup rendered into via a portal)
    return containerElement ? getOwnerWindow(containerElement) : null;
  }

  return scrollElement ?? null;
}

export function getScrollPosition(
  target: ScrollTarget,
  direction: Direction
): number {
  if (isWindow(target)) {
    return direction === "vertical" ? target.scrollY : target.scrollX;
  }

  return direction === "vertical" ? target.scrollTop : target.scrollLeft;
}

export function getMaxScrollPosition(
  target: ScrollTarget,
  direction: Direction
): number {
  const element = isWindow(target)
    ? (target.document.scrollingElement ?? target.document.documentElement)
    : target;

  return direction === "vertical"
    ? element.scrollHeight - element.clientHeight
    : element.scrollWidth - element.clientWidth;
}

export function scrollTargetTo(
  target: ScrollTarget | null,
  options: ScrollToOptions
) {
  if (target && typeof target.scrollTo === "function") {
    target.scrollTo(options);
  }
}

/**
 * Whether the container scrolls its own content along this axis
 * (e.g. a grid that scrolls its columns while rows scroll with the page).
 */
export function isSelfScrolling(
  containerElement: HTMLElement,
  direction: Direction
): boolean {
  const { overflowX, overflowY } =
    getOwnerWindow(containerElement).getComputedStyle(containerElement);
  const overflow = direction === "vertical" ? overflowY : overflowX;
  if (overflow === "visible" || overflow === "clip") {
    // Rows that overflow their estimated size can't be scrolled to
    return false;
  }

  // Allow for rounding (scroll and client sizes are rounded separately, e.g. for fractional item sizes)
  return direction === "vertical"
    ? containerElement.scrollHeight - containerElement.clientHeight > 1
    : containerElement.scrollWidth - containerElement.clientWidth > 1;
}

/**
 * Measures the region of the container that is visible within the scroll element's viewport.
 *
 * Offsets are relative to the start of the container's content (the right edge for horizontal RTL content):
 * - offset and size describe the visible region (size is 0 if the container is outside of the viewport)
 * - viewportOffset is the position of the viewport's start (negative if the container starts after it)
 * - viewportSize is the size of the scroll element's viewport
 */
export function measureScrollElementViewport({
  containerElement,
  direction,
  isRtl,
  scrollTarget
}: {
  containerElement: HTMLElement;
  direction: Direction;
  isRtl: boolean;
  scrollTarget: ScrollTarget;
}): {
  offset: number;
  size: number;
  viewportOffset: number;
  viewportSize: number;
} {
  const isVertical = direction === "vertical";

  let viewStart: number;
  let viewportSize: number;
  if (isWindow(scrollTarget)) {
    const { documentElement } = scrollTarget.document;
    viewStart = 0;
    viewportSize = isVertical
      ? documentElement.clientHeight
      : documentElement.clientWidth;
  } else {
    const rect = scrollTarget.getBoundingClientRect();
    viewStart = isVertical
      ? rect.top + scrollTarget.clientTop
      : rect.left + scrollTarget.clientLeft;
    viewportSize = isVertical
      ? scrollTarget.clientHeight
      : scrollTarget.clientWidth;
  }
  const viewEnd = viewStart + viewportSize;

  // Positions are measured in client (physical) coordinates, so they don't depend on RTL scroll offset types
  const rect = containerElement.getBoundingClientRect();
  const elementStart = isVertical
    ? rect.top + containerElement.clientTop
    : rect.left + containerElement.clientLeft;
  const elementSize = isVertical
    ? containerElement.clientHeight
    : containerElement.clientWidth;
  const elementEnd = elementStart + elementSize;

  // The container may also scroll its own content (e.g. a grid's columns)
  const ownScrollOffset = adjustScrollOffsetForRtl({
    containerElement,
    direction,
    isRtl,
    scrollOffset: isVertical
      ? containerElement.scrollTop
      : containerElement.scrollLeft
  });

  const isReversed = !isVertical && isRtl;
  const viewportStartWithinElement = isReversed
    ? elementEnd - viewEnd
    : viewStart - elementStart;
  const viewportEndWithinElement = viewportStartWithinElement + viewportSize;

  const visibleStart = Math.max(0, viewportStartWithinElement);
  const visibleEnd = Math.min(elementSize, viewportEndWithinElement);

  return {
    offset: ownScrollOffset + visibleStart,
    size: Math.max(0, visibleEnd - visibleStart),
    viewportOffset: ownScrollOffset + viewportStartWithinElement,
    viewportSize
  };
}

/**
 * CSS scroll-padding of the element (or window) being scrolled, along one axis;
 * like the browser's own scrollIntoView, scrolling to an item aligns it within the padded viewport
 * (e.g. so it isn't hidden under a sticky header).
 *
 * Percentages are relative to the viewport size; other values (e.g. "auto") are treated as 0.
 */
export function getScrollPadding({
  direction,
  isRtl,
  scrollTarget,
  viewportSize
}: {
  direction: Direction;
  isRtl: boolean;
  scrollTarget: ScrollTarget;
  viewportSize: number;
}): { end: number; start: number } {
  // The window's scroll padding is specified on the root element
  const element = isWindow(scrollTarget)
    ? scrollTarget.document.documentElement
    : scrollTarget;
  const style = getOwnerWindow(element).getComputedStyle(element);

  const parse = (value: string | undefined) => {
    const number = parseFloat(value ?? "");
    if (!Number.isFinite(number) || number < 0) {
      return 0;
    } else if (value!.endsWith("px")) {
      return number;
    } else if (value!.endsWith("%")) {
      return (number * viewportSize) / 100;
    }
    return 0;
  };

  if (direction === "vertical") {
    return {
      end: parse(style.scrollPaddingBottom),
      start: parse(style.scrollPaddingTop)
    };
  }

  // Horizontal RTL content starts at the right edge
  const left = parse(style.scrollPaddingLeft);
  const right = parse(style.scrollPaddingRight);
  return isRtl ? { end: left, start: right } : { end: right, start: left };
}
