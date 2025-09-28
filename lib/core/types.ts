export type Bounds = {
  size: number;
  scrollOffset: number;
};

export type CachedBounds = {
  getEstimatedSize(): number | undefined;
  getItemBounds(index: number): Bounds | undefined;
  hasItemBounds(index: number): boolean;
  setItemSize(index: number, size: number): void;
  size: number;
};

export type Direction = "horizontal" | "vertical";

export type SizeFunction<Props extends object> = (
  index: number,
  props: Props
) => number;
