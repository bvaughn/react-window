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
   * This component will receive `columnIndex`, `rowIndex`, and `style` props by default.
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
  ) => ReactElement | null;

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
   * Grids use the column index as a `key` by default.
   * This prop can be used along with the `rowKey` prop to provide a custom `key` value.
   *
   * ℹ️ Custom keys can ensure better UX for sortable or filterable grids,
   * particularly if your cell components are stateful.
   * Refer to the [React documentation](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) for more info.
   *
   * ⚠️ This prop cannot be auto-memoized because it is called during render.
   * It is important to always `useCallback` for this prop; do not use an inline function.
   */
  columnKey?: (args: {
    columnIndex: number;
    data: CellProps;
    rowIndex: number;
  }) => React.Key;

  /**
   * Column width; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the grid's current width (string)
   * - function that returns the column width (in pixels) given an index and `cellProps`
   *
   * ℹ️ Percentage widths can't be resolved during server rendering unless a `defaultWidth` (or a pixel width via the `style` prop) is specified.
   */
  columnWidth:
    | number
    | string
    | ((index: number, cellProps: CellProps) => number);

  /**
   * Default height of grid (in pixels) for initial render, before its actual height has been measured.
   *
   * ℹ️ Grids can't be measured during server rendering, so this value determines how many rows are server rendered.
   * It's recommended to set this to the expected height of the grid (or to specify a pixel height via the `style` prop).
   */
  defaultHeight?: number;

  /**
   * Initial horizontal scroll offset (in pixels) of the grid.
   * This value is only applied once, when the grid first mounts with at least one column.
   *
   * ℹ️ Server-rendered HTML can't be pre-scrolled, so server rendering always starts at the first column;
   * the default scroll offset is applied once the grid hydrates.
   *
   * ⚠️ If the grid can't be scrolled that far when the offset is applied (e.g. it is hidden with `display: none`,
   * or uses percentage column widths before its width has been measured), the offset is clamped or ignored and not retried.
   * Specify a `defaultWidth` (or a pixel width via the `style` prop) when using percentage column widths.
   */
  defaultScrollLeft?: number;

  /**
   * Initial vertical scroll offset (in pixels) of the grid.
   * This value is only applied once, when the grid first mounts with at least one row.
   *
   * ℹ️ Server-rendered HTML can't be pre-scrolled, so server rendering always starts at the first row;
   * the default scroll offset is applied once the grid hydrates.
   *
   * ⚠️ If the grid can't be scrolled that far when the offset is applied (e.g. it is hidden with `display: none`,
   * or uses percentage row heights before its height has been measured), the offset is clamped or ignored and not retried.
   * Specify a `defaultHeight` (or a pixel height via the `style` prop) when using percentage row heights.
   */
  defaultScrollTop?: number;

  /**
   * Default width of grid (in pixels) for initial render, before its actual width has been measured.
   *
   * ℹ️ Grids can't be measured during server rendering, so this value determines how many columns are server rendered.
   * It's recommended to set this to the expected width of the grid (or to specify a pixel width via the `style` prop).
   */
  defaultWidth?: number;

  /**
   * Indicates the directionality of grid cells.
   *
   * ℹ️ The directionality of an ancestor element can't be detected during server rendering;
   * specify this prop explicitly for server-rendered right-to-left grids.
   *
   * ℹ️ See HTML `dir` [global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir) for more information.
   */
  dir?: "ltr" | "rtl";

  /**
   * Imperative Grid API.
   *
   * ℹ️ The `useGridRef` and `useGridCallbackRef` hooks are exported for convenience in TypeScript projects.
   */
  gridRef?: Ref<{
    /**
     * Outermost HTML element for the grid if mounted and null if not mounted.
     */
    get element(): HTMLDivElement | null;

    /**
     * Scrolls the grid so that the specified row and column are visible.
     * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
     * (e.g. `scroll-padding-top` can leave room for a sticky header).
     *
     * @param behavior Determines whether scrolling is instant or animates smoothly
     * @param columnAlign Determines the horizontal alignment of the element within the grid
     * @param columnIndex Index of the column to scroll to (0-based)
     * @param rowAlign Determines the vertical alignment of the element within the grid
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
     * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
     * (e.g. `scroll-padding-top` can leave room for a sticky header).
     *
     * @param align Determines the horizontal alignment of the element within the grid
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
     * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
     * (e.g. `scroll-padding-top` can leave room for a sticky header).
     *
     * @param align Determines the vertical alignment of the element within the grid
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
   *
   * ℹ️ Percentage heights can't be resolved during server rendering unless a `defaultHeight` (or a pixel height via the `style` prop) is specified.
   */
  rowHeight:
    | number
    | string
    | ((index: number, cellProps: CellProps) => number);

  /**
   * Grids use the row index as a `key` by default.
   * This prop can be used along with the `columnKey` prop to provide a custom `key` value.
   *
   * ℹ️ Custom keys can ensure better UX for sortable or filterable grids,
   * particularly if your cell components are stateful.
   * Refer to the [React documentation](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) for more info.
   *
   * ⚠️ This prop cannot be auto-memoized because it is called during render.
   * It is important to always `useCallback` for this prop; do not use an inline function.
   */
  rowKey?: (args: { data: CellProps; rowIndex: number }) => React.Key;

  /**
   * Element that scrolls the grid, for grids that scroll along with other content (e.g. the page):
   * - "window" to scroll with the page
   * - an ancestor element that scrolls (e.g. stored with a `useState` ref callback); `null` until it has mounted
   *
   * The grid renders at its full height and only renders the rows (and columns) visible within the scroll element's viewport.
   * Its position within the scroll element is measured whenever it renders, scrolls, or resizes,
   * and whenever content before it is resized, inserted, or removed (e.g. an image loading above the grid).
   * - columns scroll with the scroll element too if the grid is as wide as its content (e.g. `style={{ width: "max-content" }}`);
   *   otherwise the grid fills the width of its parent and its columns scroll within it
   * - `scrollToCell`, `scrollToColumn` and `scrollToRow` scroll whichever element scrolls each axis
   * - `defaultHeight` and `defaultWidth` are used as the viewport size until the scroll element has been measured (e.g. during server rendering)
   * - percentage row heights and column widths are relative to the scroll element's viewport
   * - `defaultScrollLeft` and `defaultScrollTop` are ignored
   *
   * ℹ️ While the scroll element is `null`, the grid renders the first rows (as it does during server rendering).
   *
   * ⚠️ The grid's `onScroll` handler is only called when the grid scrolls its own columns;
   * listen to the scroll element's "scroll" events instead (or use the `useIsScrolling` hook).
   */
  scrollElement?: "window" | HTMLElement | null;

  /**
   * Optional CSS properties.
   * The grid of cells will fill the height and width defined by this style.
   */
  style?: CSSProperties;

  /**
   * Can be used to override the root HTML element rendered by the Grid component.
   * The default value is "div", meaning that Grid renders an HTMLDivElement as its root.
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
 * ℹ️ The `useGridRef` and `useGridCallbackRef` hooks are exported for convenience in TypeScript projects.
 */
export interface GridImperativeAPI {
  /**
   * Outermost HTML element for the grid if mounted and null if not mounted.
   */
  get element(): HTMLDivElement | null;

  /**
   * Scrolls the grid so that the specified row and column are visible.
   * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
   * (e.g. `scroll-padding-top` can leave room for a sticky header).
   *
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param columnAlign Determines the horizontal alignment of the element within the grid
   * @param columnIndex Index of the column to scroll to (0-based)
   * @param rowAlign Determines the vertical alignment of the element within the grid
   * @param rowIndex Index of the row to scroll to (0-based)
   *
   * @throws RangeError if an invalid row or column index is provided
   */
  scrollToCell: ({
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
  }) => void;

  /**
   * Scrolls the grid so that the specified column is visible.
   * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
   * (e.g. `scroll-padding-top` can leave room for a sticky header).
   *
   * @param align Determines the horizontal alignment of the element within the grid
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param index Index of the column to scroll to (0-based)
   *
   * @throws RangeError if an invalid column index is provided
   */
  scrollToColumn: ({
    align,
    behavior,
    index
  }: {
    align?: "auto" | "center" | "end" | "smart" | "start";
    behavior?: "auto" | "instant" | "smooth";
    index: number;
  }) => void;

  /**
   * Scrolls the grid so that the specified row is visible.
   * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
   * (e.g. `scroll-padding-top` can leave room for a sticky header).
   *
   * @param align Determines the vertical alignment of the element within the grid
   * @param behavior Determines whether scrolling is instant or animates smoothly
   * @param index Index of the row to scroll to (0-based)
   *
   * @throws RangeError if an invalid row index is provided
   */
  scrollToRow: ({
    align,
    behavior,
    index
  }: {
    align?: "auto" | "center" | "end" | "smart" | "start";
    behavior?: "auto" | "instant" | "smooth";
    index: number;
  }) => void;
}
