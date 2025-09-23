export type Bounds = {
  size: number;
  scrollOffset: number;
};

export type CachedBounds = {
  getEstimatedSize(): number;
  getItemBounds(index: number): Bounds;
  size: number;
};

export type Direction = "horizontal" | "vertical";

export type SizeFunction<Props extends object> = (
  index: number,
  props: Props
) => number;
