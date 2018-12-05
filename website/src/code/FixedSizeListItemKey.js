function itemKey(index, data) {
  // Find the item at the specified index.
  // In this case "data" is an Array that was passed to List as "itemData".
  const item = data[index];

  // Return a value that uniquely identifies this item.
  // Typically this will be a UID of some sort.
  return item.id;
}