import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import type { TagNames } from "../../types";

export type DynamicRowHeight = {
  getAverageRowHeight(): number;
  getRowHeight(index: number): number | undefined;
  setRowHeight(index: number, size: number): void;
  observeRowElements: (elements: Element[] | NodeListOf<Element>) => () => void;
};

type ForbiddenKeys = "ariaAttributes" | "index" | "style";
type ExcludeForbiddenKeys<Type> = {
  [Key in keyof Type]: Key extends ForbiddenKeys ? never : Type[Key];
};

export type ListProps<
  RowProps extends object,
  TagName extends TagNames = "div"
> = Omit<HTMLAttributes<HTMLDivElement>, "onResize"> & {
  /**
   * Additional content to be rendered within the list (above cells).
   * This property can be used to render things like overlays or tooltips.
   */
  children?: ReactNode;

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
   * ℹ️ The `useListRef` and `useListCallbackRef` hooks are exported for convenience use in TypeScript projects.
   */
  listRef?: Ref<{
    /**
     * Outermost HTML element for the list if mounted and null (if not mounted.
     */
    get element(): HTMLDivElement | null;

    /**
     * Scrolls the list so that the specified row is visible.
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
  onRowsRendered?: (
    visibleRows: { startIndex: number; stopIndex: number },
    allRows: { startIndex: number; stopIndex: number }
  ) => void;

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
   * ℹ️ The prop types for this component are exported as `RowComponentProps`
   */
  rowComponent: (
    props: {
      ariaAttributes: {
        "aria-posinset": number;
        "aria-setsize": number;
        role: "listitem";
      };
      index: number;
      style: CSSProperties;
    } & RowProps
  ) => ReactElement;

  /**
   * Number of items to be rendered in the list.
   */
  rowCount: number;

  /**
   * Row height; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the grid's current height (string)
   * - function that returns the row height (in pixels) given an index and `cellProps`
   * - dynamic row height cache returned by the `useDynamicRowHeight` hook
   *
   * ⚠️ Dynamic row heights are not as efficient as predetermined sizes.
   * It's recommended to provide your own height values if they can be determined ahead of time.
   */
  rowHeight:
    | number
    | string
    | ((index: number, cellProps: RowProps) => number)
    | DynamicRowHeight;

  /**
   * Additional props to be passed to the row-rendering component.
   * List will automatically re-render rows when values in this object change.
   *
   * ⚠️ This object must not contain `ariaAttributes`, `index`, or `style` props.
   */
  rowProps: ExcludeForbiddenKeys<RowProps>;

  /**
   * Optional CSS properties.
   * The list of rows will fill the height defined by this style.
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

/**
 * Ref used to interact with this component's imperative API.
 *
 * This API has imperative methods for scrolling and a getter for the outermost DOM element.
 *
 * ℹ️ The `useListRef` and `useListCallbackRef` hooks are exported for convenience use in TypeScript projects.
 */
export type ListImperativeAPI = {
  /**
   * Outermost HTML element for the list if mounted and null (if not mounted.
   */
  get element(): HTMLDivElement | null;

  /**
   * Scrolls the list so that the specified row is visible.
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
