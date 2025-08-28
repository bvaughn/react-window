import type { Direction } from "../core/types";
import { getRTLOffsetType } from "./getRTLOffsetType";

export function adjustScrollOffsetForRtl({
  containerElement,
  direction,
  isRtl,
  scrollOffset
}: {
  containerElement: HTMLElement | null;
  direction: Direction;
  isRtl: boolean;
  scrollOffset: number;
}) {
  // TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
  // This is not the case for all browsers though (e.g. Chrome reports values as positive, measured relative to the left).
  // So we need to determine which browser behavior we're dealing with, and mimic it.
  if (direction === "horizontal") {
    if (isRtl) {
      switch (getRTLOffsetType()) {
        case "negative": {
          return -scrollOffset;
        }
        case "positive-descending": {
          if (containerElement) {
            const { clientWidth, scrollLeft, scrollWidth } = containerElement;
            return scrollWidth - clientWidth - scrollLeft;
          }
          break;
        }
      }
    }
  }
  return scrollOffset;
}
