function itemKey(index) {
  // Find the item at the specified index:
  const item = items[index];

  // Return a value that uniquely identifies this item.
  // Typically this will be a UID of some sort.
  return item.id;
}