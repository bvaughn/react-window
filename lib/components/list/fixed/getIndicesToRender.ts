export function getIndicesToRender({
  height,
  rowCount,
  rowHeight,
  scrollTop,
}: {
  height: number;
  rowCount: number;
  rowHeight: number;
  scrollTop: number;
}) {
  const startIndex = Math.max(
    0,
    Math.min(rowCount - 1, Math.floor(scrollTop / rowHeight)),
  );

  const numVisibleItems = Math.ceil(
    (height + scrollTop - startIndex * rowHeight) / rowHeight,
  );
  const stopIndex = Math.max(
    0,
    Math.min(
      rowCount - 1,
      startIndex + numVisibleItems - 1, // -1 is because stop index is inclusive
    ),
  );

  return [startIndex, stopIndex];
}
