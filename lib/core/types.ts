export type Bounds = {
  size: number;
  scrollOffset: number;
};

export type CachedBounds = {
  /**
   * Fixed size, when bounds can be calculated without measuring earlier items.
   */
  itemSize?: number;
  get(index: number): Bounds;
  set(index: number, bounds: Bounds): void;
  size: number;
};

export type Direction = "horizontal" | "vertical";

export type SizeFunction<Props extends object> = (
  index: number,
  props: Props
) => number;
