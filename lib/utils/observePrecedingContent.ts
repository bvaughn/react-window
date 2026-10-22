import { getOwnerWindow } from "./getOwnerWindow";
import { getResizeObserverClass } from "./getResizeObserverClass";

/**
 * Notifies when content that precedes an element within a scroll container may have moved it
 * (without the element itself being rendered, scrolled, or resized), e.g.
 * - an image or font loading above the element
 * - a section above the element expanding or collapsing
 * - content being inserted before (or removed from before) the element
 *
 * Only content that precedes the element (or one of its ancestors) can push it, so that's all that is observed:
 * - a ResizeObserver watches the earlier siblings of the element and of each ancestor up to the container
 * - a MutationObserver watches each of those ancestors (and the container) for inserted or removed children
 *
 * ⚠️ Changes that don't resize an element (e.g. margins or transforms) and layouts where later content moves the element
 * (e.g. flex or grid alignment) are not observed.
 *
 * @returns a function that stops observing
 */
export function observePrecedingContent({
  container,
  element,
  onChange
}: {
  container: Element;
  element: Element;
  onChange: () => void;
}): () => void {
  const ownerWindow = getOwnerWindow(element);
  const ResizeObserverClass = getResizeObserverClass(element);
  const MutationObserverClass =
    ownerWindow.MutationObserver ??
    (typeof MutationObserver !== "undefined" ? MutationObserver : undefined);

  const resizeObserver = ResizeObserverClass
    ? new ResizeObserverClass(onChange)
    : undefined;

  // Whether a node comes before the element (or contains it);
  // nodes that are no longer connected can't be compared, so assume that they did
  const precedesElement = (node: Node) =>
    !node.isConnected ||
    (node.compareDocumentPosition(element) &
      Node.DOCUMENT_POSITION_FOLLOWING) !==
      0;

  const mutationObserver = MutationObserverClass
    ? new MutationObserverClass((records) => {
        // Only content inserted or removed before the element can move it;
        // e.g. portals (tooltips, modals) are usually inserted at the end of the <body>
        const affectsElement = records.some(
          (record) =>
            Array.from(record.addedNodes).some(precedesElement) ||
            // Removed nodes preceded the element if the node after them still does (or contains the element)
            (record.removedNodes.length > 0 &&
              record.nextSibling !== null &&
              precedesElement(record.nextSibling))
        );
        if (affectsElement) {
          // Inserted or removed elements change which siblings precede the element
          observe();
          onChange();
        }
      })
    : undefined;

  const observedElements = new Set<Element>();

  const observe = () => {
    // Unobserve elements individually (rather than disconnecting) so the ResizeObserver can be reused
    for (const sibling of observedElements) {
      resizeObserver?.unobserve(sibling);
    }
    observedElements.clear();
    mutationObserver?.disconnect();

    let current: Element = element;
    while (current !== container) {
      const parent: Element | null = current.parentElement;
      if (parent === null) {
        // The element isn't within the container (e.g. it has been removed)
        break;
      }

      if (resizeObserver) {
        for (
          let sibling = current.previousElementSibling;
          sibling !== null;
          sibling = sibling.previousElementSibling
        ) {
          observedElements.add(sibling);
          resizeObserver.observe(sibling);
        }
      }

      mutationObserver?.observe(parent, { childList: true });

      current = parent;
    }
  };

  observe();

  return () => {
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
  };
}
