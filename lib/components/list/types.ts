import type { ComponentType, CSSProperties, Ref } from "react";

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

export type RowComponentProps<RowProps> = RowProps & {
  index: number;
  style: CSSProperties;
};

export type RowComponent<RowProps> = ComponentType<RowComponentProps<RowProps>>;

export type OnRowsRendered = (args: {
  startIndex: number;
  stopIndex: number;
}) => void;

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
   * Ref used to interact with this component's imperative API.
   *
   * This API has imperative methods for scrolling and a getter for the outermost DOM element.
   */
  listRef?: Ref<ListImperativeAPI>;

  /**
   * React component responsible for rendering a row.
   *
   * This component will receive an `index` and `style` prop by default.
   * Additionally it will receive prop values passed to `rowProps`.
   */
  rowComponent: RowComponent<RowProps>;

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

export type CachedBounds = Map<
  number,
  {
    height: number;
    scrollTop: number;
  }
>;
