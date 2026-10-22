/**
 * Attribute that List sets on each rendered row.
 */
export const DATA_ATTRIBUTE_LIST_INDEX = "data-react-window-index";

/**
 * Attribute that items rendered with the `useVirtualizer` hook set themselves.
 */
export const DATA_ATTRIBUTE_INDEX = "data-index";

/**
 * Index of a rendered item (row), or undefined if the element doesn't specify a valid one
 * (e.g. a data-index attribute used for something else, like "row-5").
 */
export function getItemIndex(element: Element): number | undefined {
  const attribute =
    element.getAttribute(DATA_ATTRIBUTE_LIST_INDEX) ??
    element.getAttribute(DATA_ATTRIBUTE_INDEX);

  // Only non-negative integers (note that Number("") would be 0)
  return attribute !== null && /^\d+$/.test(attribute)
    ? Number(attribute)
    : undefined;
}
