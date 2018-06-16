function itemKey({ columnIndex, rowIndex }) {
  // Find the item for the specified indices:
  const item = items[rowIndex];

  // Return a value that uniquely identifies this item.
  // For a grid, this key must represent both the row and column.
  // Typically this will be something dynamic like a UID for the row,
  // Mixed with something more static like the incoming column index.
  return `${item.id}-${columnIndex}`;
}