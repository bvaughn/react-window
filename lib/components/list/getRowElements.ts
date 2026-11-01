/**
 * Matches the elements rendered within a list to the indices of the rows they render.
 *
 * Rows that spread ariaAttributes identify themselves (by aria-posinset),
 * regardless of render order or how many elements each row renders.
 * Other rows can only be matched by their position:
 * they are rendered before additional children (e.g. overlays), except in flow layout.
 */
export function getRowElements({
  elements,
  isFlowLayout,
  rowCount,
  startIndex,
  stopIndex
}: {
  elements: Element[];
  isFlowLayout: boolean;
  rowCount: number;
  startIndex: number;
  stopIndex: number;
}): { element: Element; index: number }[] {
  if (startIndex < 0 || stopIndex < startIndex) {
    return [];
  }

  const rows: { element: Element; index: number }[] = [];
  const indices = new Set<number>();
  let isValid = true;
  for (const element of elements) {
    const posInSet = element.getAttribute("aria-posinset");
    if (posInSet === null) {
      continue;
    }

    // Values that don't match the rendered rows have been overridden (e.g. to number rows within groups)
    // and can't be used to identify rows
    const index = Number(posInSet) - 1;
    if (
      !/^\d+$/.test(posInSet) ||
      index < startIndex ||
      index > stopIndex ||
      indices.has(index) ||
      element.getAttribute("aria-setsize") !== `${rowCount}`
    ) {
      isValid = false;
      break;
    }

    indices.add(index);
    rows.push({ element, index });
  }

  if (isValid && rows.length > 0) {
    return rows;
  }

  const count = Math.min(elements.length, stopIndex - startIndex + 1);
  return (
    isFlowLayout
      ? elements.slice(elements.length - count)
      : elements.slice(0, count)
  ).map((element, offset) => ({ element, index: startIndex + offset }));
}
