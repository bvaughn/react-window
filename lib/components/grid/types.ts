import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import type { TagNames } from "../../types";

type ForbiddenKeys = "ariaAttributes" | "columnIndex" | "rowIndex" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type GridProps<
  CellProps extends object,
  TagName extends TagNames = "div"
> = Omit<HTMLAttributes<HTMLDivElement>, "onResize"> & {
  /**
   * React component responsible for rendering a cell.
   *
   * This component will receive an `index` and `style` prop by default.
   * Additionally it will receive prop values passed to `cellProps`.
   *
   * ℹ️ The prop types for this component are exported as `CellComponentProps`
   */
  cellComponent: (
    props: {
      ariaAttributes: {
        "aria-colindex": number;
        role: "gridcell";
      };
      columnIndex: number;
      rowIndex: number;
      style: CSSProperties;
    } & CellProps
  ) => ReactElement;

  /**
   * Additional props to be passed to the cell-rendering component.
   * Grid will automatically re-render cells when values in this object change.
   *
   * ⚠️ This object must not contain `ariaAttributes`, `columnIndex`, `rowIndex`, or `style` props.
   */
  cellProps: ExcludeForbiddenKeys<CellProps>;

  /**
   * Additional content to be rendered within the grid (above cells).
   * This property can be used to render things like overlays or tooltips.
   */
  children?: ReactNode;

  /**
   * CSS class name.
   */
  className?: string;

  /**
   * Number of columns to be rendered in the grid.
   */
  columnCount: number;

  /**
   * Column width; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the grid's current width (string)
   * - function that returns the row width (in pixels) given an index and `cellProps`
   */
  columnWidth:
    | number
    | string
    | ((index: number, cellProps: CellProps) => number);

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
   * Corresponds to the HTML dir attribute:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir
   */
  dir?: "ltr" | "rtl";

  /**
   * Ref used to interact with this component's imperative API.
   *
   * This API has imperative methods for scrolling and a getter for the outermost DOM element.
   *
   * ℹ️ The `useGridRef` and `useGridCallbackRef` hooks are exported for convenience use in TypeScript projects.
   */
  gridRef?: Ref<{
    /**
     * Outermost HTML element for the grid if mounted and null (if not mounted.
     */
    get element(): HTMLDivElement | null;

    /**
     * Scrolls the grid so that the specified row and column are visible.
     *
     * @param behavior Determines whether scrolling is instant or animates smoothly
     * @param columnAlign Determines the horizontal alignment of the element within the list
     * @param columnIndex Index of the column to scroll to (0-based)
     * @param rowAlign Determines the vertical alignment of the element within the list
     * @param rowIndex Index of the row to scroll to (0-based)
     *
     * @throws RangeError if an invalid row or column index is provided
     */
    scrollToCell(config: {
      behavior?: "auto" | "instant" | "smooth";
      columnAlign?: "auto" | "center" | "end" | "smart" | "start";
      columnIndex: number;
      rowAlign?: "auto" | "center" | "end" | "smart" | "start";
      rowIndex: number;
    }): void;

    /**
     * Scrolls the grid so that the specified column is visible.
     *
     * @param align Determines the horizontal alignment of the element within the list
     * @param behavior Determines whether scrolling is instant or animates smoothly
     * @param index Index of the column to scroll to (0-based)
     *
     * @throws RangeError if an invalid column index is provided
     */
    scrollToColumn(config: {
      align?: "auto" | "center" | "end" | "smart" | "start";
      behavior?: "auto" | "instant" | "smooth";
      index: number;
    }): void;

    /**
     * Scrolls the grid so that the specified row is visible.
     *
     * @param align Determines the vertical alignment of the element within the list
     * @param behavior Determines whether scrolling is instant or animates smoothly
     * @param index Index of the row to scroll to (0-based)
     *
     * @throws RangeError if an invalid row index is provided
     */
    scrollToRow(config: {
      align?: "auto" | "center" | "end" | "smart" | "start";
      behavior?: "auto" | "instant" | "smooth";
      index: number;
    }): void;
  }>;

  /**
   * Callback notified when the range of rendered cells changes.
   */
  onCellsRendered?: (
    visibleCells: {
      columnStartIndex: number;
      columnStopIndex: number;
      rowStartIndex: number;
      rowStopIndex: number;
    },
    allCells: {
      columnStartIndex: number;
      columnStopIndex: number;
      rowStartIndex: number;
      rowStopIndex: number;
    }
  ) => void;

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
   * Row height; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the grid's current height (string)
   * - function that returns the row height (in pixels) given an index and `cellProps`
   */
  rowHeight:
    | number
    | string
    | ((index: number, cellProps: CellProps) => number);

  /**
   * Optional CSS properties.
   * The grid of cells will fill the height and width defined by this style.
   */
  style?: CSSProperties;

  /**
   * Can be used to override the root HTML element rendered by the List component.
   * The default value is "div", meaning that List renders an HTMLDivElement as its root.
   *
   * ⚠️ In most use cases the default ARIA roles are sufficient and this prop is not needed.
   */
  tagName?: TagName;
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

/**
 * Ref used to interact with this component's imperative API.
 *
 * This API has imperative methods for scrolling and a getter for the outermost DOM element.
 *
 * ℹ️ The `useGridRef` and `useGridCallbackRef` hooks are exported for convenience use in TypeScript projects.
 */
export type GridImperativeAPI = {
  /**
   * Outermost HTML element for the grid if mounted and null (if not mounted.
   */
  get element(): HTMLDivElement | null;

  /**
   * Scrolls the grid so that the specified row and column are visible.
   *
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param columnAlign Determines the horizontal alignment of the element within the list
   * @param columnIndex Index of the column to scroll to (0-based)
   * @param rowAlign Determines the vertical alignment of the element within the list
   * @param rowIndex Index of the row to scroll to (0-based)
   *
   * @throws RangeError if an invalid row or column index is provided
   */
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

  /**
   * Scrolls the grid so that the specified column is visible.
   *
   * @param align Determines the horizontal alignment of the element within the list
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param index Index of the column to scroll to (0-based)
   *
   * @throws RangeError if an invalid column index is provided
   */
  scrollToColumn({
    align,
    behavior,
    index
  }: {
    align?: "auto" | "center" | "end" | "smart" | "start";
    behavior?: "auto" | "instant" | "smooth";
    index: number;
  }): void;

  /**
   * Scrolls the grid so that the specified row is visible.
   *
   * @param align Determines the vertical alignment of the element within the list
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param index Index of the row to scroll to (0-based)
   *
   * @throws RangeError if an invalid row index is provided
   */
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
