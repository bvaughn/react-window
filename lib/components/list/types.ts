import type { ComponentType, CSSProperties, Ref } from "react";

export type Align = "auto" | "center" | "end" | "smart" | "start";

export type SimpleListImperativeAPI = {
  get element(): HTMLDivElement | null;

  scrollToRow(index: number, align?: Align, behavior?: ScrollBehavior): void;
};

export type GetRowKey<ExtraProps> = (
  index: number,
  extraProps: ExtraProps,
) => string | number;

export type GetRowHeight<ExtraProps> = (
  index: number,
  extraProps: ExtraProps,
) => number;

type ForbiddenKeys = "index" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type RowProps<ExtraProps> = ExtraProps & {
  index: number;
  style: CSSProperties;
};

export type RowComponent<ExtraProps> = ComponentType<RowProps<ExtraProps>>;

export type OnRowsRendered = (args: {
  startIndex: number;
  stopIndex: number;
}) => void;

export type CommonListProps<ExtraProps extends object> = {
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
   * Number of items to be rendered in the list.
   */
  length: number;

  /**
   * Ref used to interact with this component's imperative API.
   *
   * This API has imperative methods for scrolling and a getter for the outermost DOM element.
   */
  listRef?: Ref<SimpleListImperativeAPI>;

  /**
   * React component responsible for rendering a row.
   *
   * This component will receive an `index` and `style` prop by default.
   * Additionally it will receive prop values passed to `rowProps`.
   */
  rowComponent: RowComponent<ExtraProps>;

  /**
   * Additional props to be passed to the rowComponent.
   *
   * This object must not contain either an `index` or `style` prop.
   * Refer to the example for more information.
   */
  rowProps?: ExcludeForbiddenKeys<ExtraProps>;

  /**
   * Callback notified when the range of visible rows changes.
   */
  onRowsRendered?: OnRowsRendered;

  /**
   * Optional CSS properties.
   * The list of rows will fill the height defined by this style.
   */
  style?: CSSProperties;
};

export type ScrollState = {
  prevScrollTop: number;
  scrollTop: number;
};
