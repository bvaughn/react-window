export function defaultCellRangeRenderer<T>({
  rowStartIndex,
  rowStopIndex,
  columnStartIndex,
  columnStopIndex,
  childFactory
}: CellRangeRendererParams<T>): React$Element<RenderComponent<T>>[] {
  const items = [];
  // rowStartIndex, rowStopIndex, columnStartIndex, and columnStopIndex are all integers
  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      // childFactory is used to create the next item in the grid
      const child = childFactory({ rowIndex, columnIndex });
      items.push(child);
    }
  }
  // Return the items to be rendered to the DOM.
  return items;
}
