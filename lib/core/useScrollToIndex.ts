import { useCallback, useRef, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useStableCallback } from "../hooks/useStableCallback";
import type { Align } from "../types";
import { getOwnerWindow } from "../utils/getOwnerWindow";
import {
  getMaxScrollPosition,
  getScrollPosition,
  type ScrollTarget
} from "../utils/scrollElement";
import { getItemIndex } from "./itemIndex";
import type { Bounds, Direction } from "./types";

const CORRECTION_DURATION = 1000;
const SMOOTH_SCROLL_DURATION = 500;

// Starting at full speed keeps back-to-back scrolls (e.g. as new rows are appended) from stalling
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Scrolls an item into view.
 *
 * Items with dynamic sizes are positioned using estimated sizes until they have been measured,
 * so scrolling to one is corrected over several frames as items around it are rendered and measured.
 * Corrections stop once the item's position is stable, after a deadline, or when the user scrolls.
 * Smooth scrolling is animated frame by frame (rather than by the browser) so that the destination can move as items are measured.
 *
 * ℹ️ Dynamic sizes are only supported for vertical lists.
 */
export function useScrollToIndex({
  direction,
  element,
  getCellBounds,
  isDynamicSize,
  itemCount,
  itemElements,
  scrollTarget,
  getScrollPositionForIndex
}: {
  direction: Direction;
  element: HTMLElement | null;
  getCellBounds: (index: number) => Bounds;
  isDynamicSize: boolean;
  itemCount: number;
  itemElements: RefObject<Element[]>;
  scrollTarget: ScrollTarget | null;
  getScrollPositionForIndex: (options: {
    align?: Align;
    index: number;
  }) => { scrollOffset: number; scrollTarget: ScrollTarget } | undefined;
}): (options: {
  align?: Align;
  behavior?: ScrollBehavior;
  index: number;
}) => void {
  const isVertical = direction === "vertical";
  const pendingScroll = useRef<{
    align: Align;
    index: number;
    smooth: boolean;
    stableFrames: number;
    // Set on the first frame, since frames are paused while the page is hidden
    animation?: {
      deadline: number;
      startOffset: number;
      startTime: number;
    };
  } | null>(null);

  // Track the window that scheduled the frame so it can be cancelled there.
  const scrollFrame = useRef<{ id: number; view: Window } | undefined>(
    undefined
  );

  const cancelScroll = useStableCallback(() => {
    pendingScroll.current = null;
    if (scrollFrame.current !== undefined) {
      scrollFrame.current.view.cancelAnimationFrame(scrollFrame.current.id);
      scrollFrame.current = undefined;
    }
  });

  // Use the list's own window (e.g. a popup rendered into via a portal),
  // since another window's frames may be throttled while it's in the background.
  const scheduleCorrectScroll = useStableCallback(() => {
    const view = getOwnerWindow(element);
    scrollFrame.current = {
      id: view.requestAnimationFrame(correctScroll),
      view
    };
  });

  const correctScroll = useStableCallback(() => {
    scrollFrame.current = undefined;
    const request = pendingScroll.current;
    if (!request) return;

    const now = performance.now();
    if (
      !element ||
      !isDynamicSize ||
      request.index >= itemCount ||
      (request.animation !== undefined && now >= request.animation.deadline)
    ) {
      cancelScroll();
      return;
    }

    const result = getScrollPositionForIndex({
      align: request.align,
      index: request.index
    });
    if (result !== undefined) {
      const { scrollOffset, scrollTarget } = result;
      // Use the committed DOM extent: the browser clamps offsets near the end.
      const offset = Math.max(
        0,
        Math.min(scrollOffset, getMaxScrollPosition(scrollTarget, direction))
      );

      if (request.animation === undefined) {
        const duration = request.smooth ? SMOOTH_SCROLL_DURATION : 0;
        request.animation = {
          deadline: now + duration + CORRECTION_DURATION,
          startOffset: getScrollPosition(scrollTarget, direction),
          startTime: now
        };
      }

      // Ease towards the latest estimate of the destination, which moves as items are measured
      const progress = request.smooth
        ? (now - request.animation.startTime) / SMOOTH_SCROLL_DURATION
        : 1;
      if (progress < 1) {
        const { startOffset } = request.animation;
        request.stableFrames = 0;
        scrollTarget.scrollTo({
          behavior: "instant",
          [isVertical ? "top" : "left"]:
            startOffset + (offset - startOffset) * easeOutCubic(progress)
        });
      } else if (
        Math.abs(offset - getScrollPosition(scrollTarget, direction)) > 1
      ) {
        request.stableFrames = 0;
        scrollTarget.scrollTo({
          behavior: "instant",
          [isVertical ? "top" : "left"]: offset
        });
      } else {
        // An unchanged estimated offset is not enough:
        // React may not have committed the destination items or their ResizeObserver updates yet.
        const items = itemElements.current;
        const targetIsRendered = items.some(
          (item) => getItemIndex(item) === request.index
        );
        const measurementsCommitted =
          targetIsRendered &&
          items.every((item) => {
            // Items without a valid index (or left over from a larger item count) can't be checked
            const index = getItemIndex(item);
            if (index === undefined || index >= itemCount) {
              return true;
            }

            // ResizeObserver reports untransformed border-box sizes.
            // offsetHeight uses the same coordinate space; allow for its integer rounding.
            const size = isVertical
              ? (item as HTMLElement).offsetHeight
              : (item as HTMLElement).offsetWidth;
            return Math.abs(getCellBounds(index).size - size) <= 1;
          });
        if (!measurementsCommitted) {
          request.stableFrames = 0;
        } else if (++request.stableFrames >= 2) {
          cancelScroll();
          return;
        }
      }
    }
    scheduleCorrectScroll();
  });

  // User input cancels pending corrections;
  // lists that scroll with an outer element (e.g. the page) can be scrolled from outside of the list
  useIsomorphicLayoutEffect(() => {
    const target = scrollTarget ?? element;
    if (!target) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
        case " ": {
          cancelScroll();
        }
      }
    };

    target.addEventListener("wheel", cancelScroll, { passive: true });
    target.addEventListener("touchstart", cancelScroll, { passive: true });
    target.addEventListener("pointerdown", cancelScroll);
    target.addEventListener("keydown", onKeyDown as EventListener);

    return () => {
      cancelScroll();

      target.removeEventListener("wheel", cancelScroll);
      target.removeEventListener("touchstart", cancelScroll);
      target.removeEventListener("pointerdown", cancelScroll);
      target.removeEventListener("keydown", onKeyDown as EventListener);
    };
  }, [cancelScroll, element, scrollTarget]);

  return useCallback(
    ({
      align = "auto",
      behavior = "auto",
      index
    }: {
      align?: Align;
      behavior?: ScrollBehavior;
      index: number;
    }) => {
      // Resolve smart alignment once, before measurements move the target.
      if (isDynamicSize && align === "smart") {
        const auto = getScrollPositionForIndex({ align: "auto", index });
        align =
          auto === undefined ||
          auto.scrollOffset === getScrollPosition(auto.scrollTarget, direction)
            ? "auto"
            : "center";
      }

      const result = getScrollPositionForIndex({ align, index });

      cancelScroll();

      if (result && typeof result.scrollTarget.scrollTo === "function") {
        const { scrollOffset, scrollTarget } = result;
        if (isDynamicSize) {
          // There's no point in animating a scroll that can't be seen
          const smooth =
            behavior === "smooth" &&
            element?.ownerDocument.visibilityState !== "hidden";

          pendingScroll.current = {
            align,
            index,
            smooth,
            stableFrames: 0
          };
          scheduleCorrectScroll();

          // Smooth scrolling starts on the next frame
          if (smooth) {
            return;
          }
        }
        scrollTarget.scrollTo({
          behavior: isDynamicSize ? "instant" : behavior,
          [isVertical ? "top" : "left"]: scrollOffset
        });
      }
    },
    [
      cancelScroll,
      direction,
      element,
      isDynamicSize,
      isVertical,
      scheduleCorrectScroll,
      getScrollPositionForIndex
    ]
  );
}
