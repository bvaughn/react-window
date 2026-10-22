import { useState } from "react";
import { getOwnerWindow } from "../utils/getOwnerWindow";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Tracks whether an element (or the window) is currently scrolling,
 * e.g. to render simplified content in place of rows that are expensive to render.
 *
 * Pass the element that scrolls:
 * - a list or grid's own element (e.g. from `useListCallbackRef`)
 * - "window" or the scroll element, for lists and grids that use the `scrollElement` prop
 *
 * Scrolling ends when the browser fires a "scrollend" event or,
 * in browsers that don't support that event, after no scroll events have been received for `delay` milliseconds.
 *
 * ℹ️ Scrolling that starts and ends before React renders (e.g. an instant scroll) may not change this value.
 *
 * ⚠️ Changing this value re-renders any rows it is passed to (e.g. via `rowProps`) when scrolling starts and when it ends.
 */
export function useIsScrolling(
  target: "window" | HTMLElement | null | undefined,
  {
    delay = 150
  }: {
    /**
     * Milliseconds without scroll events after which scrolling is considered to have ended
     * (only used by browsers that don't support the "scrollend" event); defaults to 150.
     */
    delay?: number;
  } = {}
): boolean {
  const [isScrolling, setIsScrolling] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!target) {
      return;
    }

    const ownerWindow =
      target === "window" ? window : getOwnerWindow(target as HTMLElement);
    const eventTarget = target === "window" ? ownerWindow : target;

    // Checked against a plain object, since TypeScript assumes all windows support the event
    const supportsScrollEnd = "onscrollend" in (ownerWindow as object);

    let animationFrameId: number | undefined = undefined;
    let lastScrollTime = 0;

    // Timeouts can be starved while scrolling (see issue #106), so check the elapsed time each frame instead
    const checkForScrollEnd = () => {
      if (performance.now() - lastScrollTime >= delay) {
        animationFrameId = undefined;
        setIsScrolling(false);
      } else {
        animationFrameId = ownerWindow.requestAnimationFrame(checkForScrollEnd);
      }
    };

    const onScroll = () => {
      setIsScrolling(true);

      if (!supportsScrollEnd) {
        lastScrollTime = performance.now();
        if (animationFrameId === undefined) {
          animationFrameId =
            ownerWindow.requestAnimationFrame(checkForScrollEnd);
        }
      }
    };

    const onScrollEnd = () => {
      setIsScrolling(false);
    };

    eventTarget.addEventListener("scroll", onScroll, { passive: true });
    if (supportsScrollEnd) {
      eventTarget.addEventListener("scrollend", onScrollEnd);
    }

    return () => {
      eventTarget.removeEventListener("scroll", onScroll);
      eventTarget.removeEventListener("scrollend", onScrollEnd);
      if (animationFrameId !== undefined) {
        ownerWindow.cancelAnimationFrame(animationFrameId);
      }

      // A different target (or none) isn't scrolling yet
      setIsScrolling(false);
    };
  }, [delay, target]);

  return isScrolling;
}
