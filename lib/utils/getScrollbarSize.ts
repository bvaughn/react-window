// Cache per document, since windows may differ (e.g. custom scrollbar styles in a popup)
const cache = new WeakMap<Document, number>();

export function getScrollbarSize(
  recalculate: boolean = false,
  ownerDocument: Document = document
): number {
  let size = cache.get(ownerDocument);
  if (size === undefined || recalculate) {
    const div = ownerDocument.createElement("div");
    const style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";

    ownerDocument.body.appendChild(div);

    size = div.offsetWidth - div.clientWidth;

    ownerDocument.body.removeChild(div);

    cache.set(ownerDocument, size);
  }

  return size;
}

export function setScrollbarSizeForTests(
  value: number,
  ownerDocument: Document = document
) {
  cache.set(ownerDocument, value);
}
