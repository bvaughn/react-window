import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref
} from "react";

type ForbiddenKeys = "index" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type ListProps<RowProps extends object> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onResize"
> & {
  /**
   * CSS class name.
   */
  className?: string;

  /**
   * Default height of list for initial render.
   * This value is important for server rendering.
   */
  defaultHeight?: number;

  /**
   * Ref used to interact with this component's imperative API.
   *
   * This API has imperative methods for scrolling and a getter for the outermost DOM element.
   *
   * ⚠️ The `useListRef` and `useListCallbackRef` hooks are exported for convenience use in TypeScript projects.
   */
  listRef?: Ref<ListImperativeAPI>;

  /**
   * Callback notified when the List's outermost HTMLElement resizes.
   * This may be used to (re)scroll a row into view.
   */
  onResize?: (
    size: { height: number; width: number },
    prevSize: { height: number; width: number }
  ) => void;

  /**
   * Callback notified when the range of visible rows changes.
   */
  onRowsRendered?: (args: { startIndex: number; stopIndex: number }) => void;

  /**
   * How many additional rows to render outside of the visible area.
   * This can reduce visual flickering near the edges of a list when scrolling.
   */
  overscanCount?: number;

  /**
   * React component responsible for rendering a row.
   *
   * This component will receive an `index` and `style` prop by default.
   * Additionally it will receive prop values passed to `rowProps`.
   *
   * ⚠️ The prop types for this component are exported as `RowComponentProps`
   */
  rowComponent: (
    props: {
      index: number;
      style: CSSProperties;
    } & RowProps
  ) => ReactNode;

  /**
   * Number of items to be rendered in the list.
   */
  rowCount: number;

  /**
   * Row height; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the grid's current height (string)
   * - function that returns the row height (in pixels) given an index and `cellProps`
   */
  rowHeight: number | string | ((index: number, cellProps: RowProps) => number);

  /**
   * Additional props to be passed to the row-rendering component.
   * List will automatically re-render rows when values in this object change.
   *
   * ⚠️ This object must not contain either an `index` or `style` prop.
   */
  rowProps: ExcludeForbiddenKeys<RowProps>;

  /**
   * Optional CSS properties.
   * The list of rows will fill the height defined by this style.
   */
  style?: CSSProperties;
};

export type RowComponent<RowProps extends object> =
  ListProps<RowProps>["rowComponent"];

export type RowComponentProps<RowProps extends object = object> =
  ComponentProps<RowComponent<RowProps>>;

export type OnRowsRendered = NonNullable<ListProps<object>["onRowsRendered"]>;

export type CachedBounds = Map<
  number,
  {
    height: number;
    scrollTop: number;
  }
>;

export type ListImperativeAPI = {
  get element(): HTMLDivElement | null;

  scrollToRow({
    align,
    behavior,
    index
  }: {
    align?: "auto" | "center" | "end" | "smart" | "start";
    behavior?: "auto" | "instant" | "smooth";
    index: number;
  }): void;
};
