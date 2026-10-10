export function getOwnerWindow(
  element: Element | null | undefined
): Window & typeof globalThis {
  return element?.ownerDocument.defaultView ?? window;
}
