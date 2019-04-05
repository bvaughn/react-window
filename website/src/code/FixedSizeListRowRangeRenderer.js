function rowRangeRenderer({ startIndex, stopIndex, childFactory }) {
  const items = [];

  // startIndex and stopIndex are integers.
  for (let index = startIndex; index <= stopIndex; index++) {
    // childFactory is used to retrieve the child that is to be rendered
    const child = childFactory({ index });
    items.push(child);
  }

  // Return the items to be rendered to the DOM.
  return items;
}
