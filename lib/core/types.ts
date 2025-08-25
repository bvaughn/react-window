export type Bounds = {
  size: number;
  scrollOffset: number;
};

export type CachedBounds = {
  averageSize: number;
  has(index: number): boolean;
  get(index: number): Bounds | undefined;
  length: number;
  set(index: number, size: number): void;
  toString(): string;
};

export type Direction = "horizontal" | "vertical";

export type SizeFunction<Props extends object> = (
  index: number,
  props: Props
) => number;
