import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref
} from "react";

type ForbiddenKeys = "columnIndex" | "rowIndex" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type GridProps<CellProps extends object> =
  HTMLAttributes<HTMLDivElement> & {
    /**
     * CSS class name.
     */
    className?: string;

    /**
     * Default height of grid for initial render.
     * This value is important for server rendering.
     */
    defaultHeight?: number;

    /**
     * Default width of grid for initial render.
     * This value is important for server rendering.
     */
    defaultWidth?: number;

    /**
     * React component responsible for rendering a cell.
     *
     * This component will receive an `index` and `style` prop by default.
     * Additionally it will receive prop values passed to `cellProps`.
     *
     * ⚠️ The prop types for this component are exported as `CellComponentProps`
     */
    cellComponent: (
      props: {
        columnIndex: number;
        rowIndex: number;
        style: CSSProperties;
      } & CellProps
    ) => ReactNode;

    /**
     * Additional props to be passed to the cell-rendering component.
     * Grid will automatically re-render cells when values in this object change.
     *
     * ⚠️ This object must not contain either an `index` or `style` prop.
     */
    cellProps: ExcludeForbiddenKeys<CellProps>;

    /**
     * Number of columns to be rendered in the grid.
     */
    columnCount: number;

    /**
     * Column width (in pixels) or a function that returns a column width (in pixels) given an index and `cellProps`.
     */
    columnWidth: number | ((index: number, cellProps: CellProps) => number);

    /**
     * Ref used to interact with this component's imperative API.
     *
     * This API has imperative methods for scrolling and a getter for the outermost DOM element.
     *
     * ⚠️ The `useGridRef` and `useGridCallbackRef` hooks are exported for convenience use in TypeScript projects.
     */
    gridRef?: Ref<GridImperativeAPI>;

    /**
     * Callback notified when the range of rendered cells changes.
     */
    onCellsRendered?: (args: {
      columnStartIndex: number;
      columnStopIndex: number;
      rowStartIndex: number;
      rowStopIndex: number;
    }) => void;

    /**
     * Callback notified when the Grid's outermost HTMLElement resizes.
     * This may be used to (re)scroll a cell into view.
     */
    onResize?: (
      size: { height: number; width: number },
      prevSize: { height: number; width: number }
    ) => void;

    /**
     * How many additional rows/columns to render outside of the visible area.
     * This can reduce visual flickering near the edges of a grid when scrolling.
     */
    overscanCount?: number;

    /**
     * Number of rows to be rendered in the grid.
     */
    rowCount: number;

    /**
     * Row height (in pixels) or a function that returns a row height (in pixels) given an index and `cellProps`.
     */
    rowHeight: number | ((index: number, cellProps: CellProps) => number);

    /**
     * Optional CSS properties.
     * The grid of cells will fill the height and width defined by this style.
     */
    style?: CSSProperties;
  };

export type CellComponent<CellProps extends object> =
  GridProps<CellProps>["cellComponent"];
export type CellComponentProps<CellProps extends object = object> =
  ComponentProps<CellComponent<CellProps>>;

export type ScrollState = {
  prevScrollTop: number;
  scrollTop: number;
};

export type OnCellsRendered = NonNullable<GridProps<object>["onCellsRendered"]>;

export type CachedBounds = Map<
  number,
  {
    height: number;
    scrollTop: number;
  }
>;

export type GridImperativeAPI = {
  get element(): HTMLDivElement | null;

  scrollToCell({
    behavior,
    columnAlign,
    columnIndex,
    rowAlign,
    rowIndex
  }: {
    behavior?: "auto" | "instant" | "smooth";
    columnAlign?: "auto" | "center" | "end" | "smart" | "start";
    columnIndex: number;
    rowAlign?: "auto" | "center" | "end" | "smart" | "start";
    rowIndex: number;
  }): void;

  scrollToColumn({
    align,
    behavior,
    index
  }: {
    align?: "auto" | "center" | "end" | "smart" | "start";
    behavior?: "auto" | "instant" | "smooth";
    index: number;
  }): void;

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
