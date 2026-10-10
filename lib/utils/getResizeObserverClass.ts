import { getOwnerWindow } from "./getOwnerWindow";

export function getResizeObserverClass(
  element: Element
): typeof ResizeObserver | undefined {
  return (
    getOwnerWindow(element).ResizeObserver ??
    (typeof ResizeObserver !== "undefined" ? ResizeObserver : undefined)
  );
}
