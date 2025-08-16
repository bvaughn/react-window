import type { ComponentProps, CSSProperties, ReactNode } from "react";

export type Align = "auto" | "center" | "end" | "smart" | "start";

export type ListImperativeAPI = {
  get element(): HTMLDivElement | null;

  scrollToRow({
    align,
    behavior,
    index,
  }: {
    align?: Align;
    behavior?: ScrollBehavior;
    index: number;
  }): void;
};

type ForbiddenKeys = "index" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type CommonListProps<RowProps extends object> = {
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
    } & RowProps,
  ) => ReactNode;

  /**
   * Number of items to be rendered in the list.
   */
  rowCount: number;

  /**
   * Additional props to be passed to the rowComponent.
   *
   * This object must not contain either an `index` or `style` prop.
   * Refer to the example for more information.
   */
  rowProps?: ExcludeForbiddenKeys<RowProps>;

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
   * Optional CSS properties.
   * The list of rows will fill the height defined by this style.
   */
  style?: CSSProperties;
};

export type RowComponent<RowProps extends object> =
  CommonListProps<RowProps>["rowComponent"];
export type RowComponentProps<RowProps extends object = object> =
  ComponentProps<RowComponent<RowProps>>;

export type ScrollState = {
  prevScrollTop: number;
  scrollTop: number;
};

export type OnRowsRendered = NonNullable<
  CommonListProps<object>["onRowsRendered"]
>;

export type CachedBounds = Map<
  number,
  {
    height: number;
    scrollTop: number;
  }
>;
