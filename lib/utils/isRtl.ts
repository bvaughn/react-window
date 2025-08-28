export function isRtl(element: HTMLElement) {
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (currentElement.dir) {
      return currentElement.dir === "rtl";
    }

    currentElement = currentElement.parentElement;
  }

  return false;
}
