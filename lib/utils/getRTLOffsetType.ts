export type RTLOffsetType =
  | "negative"
  | "positive-descending"
  | "positive-ascending";

// Cache per document, since each window is probed separately
const cache = new WeakMap<Document, RTLOffsetType>();

// TRICKY According to the spec, scrollLeft should be negative for RTL aligned elements.
// Chrome does not seem to adhere; its scrollLeft values are positive (measured relative to the left).
// Safari's elastic bounce makes detecting this even more complicated wrt potential false positives.
// The safest way to check this is to intentionally set a negative offset,
// and then verify that the subsequent "scroll" event matches the negative offset.
// If it does not match, then we can assume a non-standard RTL scroll implementation.
export function getRTLOffsetType(
  recalculate: boolean = false,
  ownerDocument: Document = document
): RTLOffsetType {
  let cachedRTLResult = cache.get(ownerDocument);
  if (cachedRTLResult === undefined || recalculate) {
    const outerDiv = ownerDocument.createElement("div");
    const outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";

    const innerDiv = ownerDocument.createElement("div");
    const innerStyle = innerDiv.style;
    innerStyle.width = "100px";
    innerStyle.height = "100px";

    outerDiv.appendChild(innerDiv);

    ownerDocument.body.appendChild(outerDiv);

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = "positive-descending";
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = "negative";
      } else {
        cachedRTLResult = "positive-ascending";
      }
    }

    ownerDocument.body.removeChild(outerDiv);

    cache.set(ownerDocument, cachedRTLResult);
  }

  return cachedRTLResult;
}
