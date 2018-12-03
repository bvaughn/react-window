function itemKey({ columnIndex, data, rowIndex }) {
  // Find the item for the specified indices.
  // In this case "data" is an Array that was passed to Grid as "itemData".
  const item = data[rowIndex];

  // Return a value that uniquely identifies this item.
  // For a grid, this key must represent both the row and column.
  // Typically this will be something dynamic like a UID for the row,
  // Mixed with something more static like the incoming column index.
  return `${item.id}-${columnIndex}`;
}