import { useCallback, useRef, type RefObject } from "react";
import type { Bounds } from "../../core/types";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useStableCallback } from "../../hooks/useStableCallback";
import type { Align } from "../../types";
import { DATA_ATTRIBUTE_LIST_INDEX } from "./List";
import type { ListImperativeAPI } from "./types";

export function useScrollToRow({
  element,
  getCellBounds,
  isDynamicRowHeight,
  rowCount,
  rowElements,
  scrollToIndex
}: {
  element: HTMLDivElement | null;
  getCellBounds: (index: number) => Bounds;
  isDynamicRowHeight: boolean;
  rowCount: number;
  rowElements: RefObject<Element[]>;
  scrollToIndex: (options: {
    align?: Align;
    containerScrollOffset: number;
    index: number;
  }) => number | undefined;
}): ListImperativeAPI["scrollToRow"] {
  const pendingScroll = useRef<{
    align: Align;
    index: number;
    deadline: number;
    stableFrames: number;
  } | null>(null);

  const scrollFrame = useRef<number | undefined>(undefined);

  const cancelScroll = useStableCallback(() => {
    pendingScroll.current = null;
    if (scrollFrame.current !== undefined) {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = undefined;
    }
  });

  const correctScroll = useStableCallback(() => {
    scrollFrame.current = undefined;
    const request = pendingScroll.current;
    if (!request) return;

    if (
      !element ||
      !isDynamicRowHeight ||
      request.index >= rowCount ||
      performance.now() >= request.deadline
    ) {
      cancelScroll();
      return;
    }

    const offset = scrollToIndex({
      align: request.align,
      containerScrollOffset: element.scrollTop,
      index: request.index
    });
    if (offset !== undefined) {
      // Use the committed DOM extent: the browser clamps offsets near the end.
      const top = Math.max(
        0,
        Math.min(offset, element.scrollHeight - element.clientHeight)
      );
      if (Math.abs(top - element.scrollTop) > 1) {
        request.stableFrames = 0;
        element.scrollTo({ behavior: "instant", top });
      } else {
        // An unchanged estimated offset is not enough:
        // React may not have committed the destination rows or their ResizeObserver updates yet.
        const rows = rowElements.current;
        const targetIsRendered = rows.some(
          (row) =>
            row.getAttribute(DATA_ATTRIBUTE_LIST_INDEX) === `${request.index}`
        );
        const measurementsCommitted =
          targetIsRendered &&
          rows.every((row) => {
            const index = Number(row.getAttribute(DATA_ATTRIBUTE_LIST_INDEX));
            // ResizeObserver reports untransformed border-box sizes.
            // offsetHeight uses the same coordinate space; allow for its integer rounding.
            return (
              Math.abs(
                getCellBounds(index).size - (row as HTMLElement).offsetHeight
              ) <= 1
            );
          });
        if (!measurementsCommitted) {
          request.stableFrames = 0;
        } else if (++request.stableFrames >= 2) {
          cancelScroll();
          return;
        }
      }
    }
    scrollFrame.current = requestAnimationFrame(correctScroll);
  });

  useIsomorphicLayoutEffect(() => {
    if (!element) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
        case " ": {
          cancelScroll();
        }
      }
    };

    element.addEventListener("wheel", cancelScroll, { passive: true });
    element.addEventListener("touchstart", cancelScroll, { passive: true });
    element.addEventListener("pointerdown", cancelScroll);
    element.addEventListener("keydown", onKeyDown);

    return () => {
      cancelScroll();

      element.removeEventListener("wheel", cancelScroll);
      element.removeEventListener("touchstart", cancelScroll);
      element.removeEventListener("pointerdown", cancelScroll);
      element.removeEventListener("keydown", onKeyDown);
    };
  }, [cancelScroll, element]);

  return useCallback(
    ({
      align = "auto",
      behavior = "auto",
      index
    }: Parameters<ListImperativeAPI["scrollToRow"]>[0]) => {
      // Resolve smart alignment once, before measurements move the target.
      if (isDynamicRowHeight && align === "smart") {
        const autoOffset = scrollToIndex({
          align: "auto",
          containerScrollOffset: element?.scrollTop ?? 0,
          index
        });
        align = autoOffset === (element?.scrollTop ?? 0) ? "auto" : "center";
      }

      const top = scrollToIndex({
        align,
        containerScrollOffset: element?.scrollTop ?? 0,
        index
      });

      cancelScroll();

      if (typeof element?.scrollTo === "function") {
        if (isDynamicRowHeight) {
          pendingScroll.current = {
            align,
            index,
            deadline: performance.now() + 1000,
            stableFrames: 0
          };
          scrollFrame.current = requestAnimationFrame(correctScroll);
        }
        element.scrollTo({
          behavior: isDynamicRowHeight ? "instant" : behavior,
          top
        });
      }
    },
    [cancelScroll, correctScroll, element, isDynamicRowHeight, scrollToIndex]
  );
}
