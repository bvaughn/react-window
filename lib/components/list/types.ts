import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  Key,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import type { TagNames } from "../../types";

/**
 * Cache of measured row heights (see `useDynamicRowHeight`).
 *
 * Heights are stored by row key when one is provided (e.g. by the `rowKey` prop of `List`),
 * so that they follow their rows when rows are inserted or removed; otherwise they're stored by index.
 */
export type DynamicRowHeight = {
  getAverageRowHeight(): number;
  getRowHeight(index: number, key?: Key): number | undefined;
  setRowHeight(index: number, size: number, key?: Key): void;
  /**
   * Measures the specified elements (each must specify its index with a data attribute) whenever they resize.
   *
   * @param rowKeys The number of rows, and the key of the row at an index (read at the time rows are measured);
   * heights are stored by key if provided, and heights of rows that are no longer in the list are eventually removed
   */
  observeRowElements: (
    elements: Element[] | NodeListOf<Element>,
    rowKeys?: RowKeys
  ) => () => void;
};

/**
 * The rows in a list, by key (see `DynamicRowHeight`).
 */
export type RowKeys = {
  count: number;
  getKey: (index: number) => Key | undefined;
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
   * Additional content to be rendered within the list (above rows).
   * This property can be used to render things like overlays or tooltips.
   */
  children?: ReactNode;

  /**
   * CSS class name.
   */
  className?: string;

  /**
   * Default height of list (in pixels) for initial render, before its actual height has been measured.
   *
   * ℹ️ Lists can't be measured during server rendering, so this value determines how many rows are server rendered.
   * It's recommended to set this to the expected height of the list (or to specify a pixel height via the `style` prop).
   *
   * @default 0
   */
  defaultHeight?: number;

  /**
   * Initial scroll offset (in pixels) of the list.
   * This value is only applied once, when the list first mounts with at least one row.
   *
   * ℹ️ Server-rendered HTML can't be pre-scrolled, so server rendering always starts at the first row;
   * the default scroll offset is applied once the list hydrates.
   *
   * ⚠️ If the list can't be scrolled that far when the offset is applied (e.g. it is hidden with `display: none`,
   * or uses percentage row heights before its height has been measured), the offset is clamped or ignored and not retried.
   * Specify a `defaultHeight` (or a pixel height via the `style` prop) when using percentage row heights.
   *
   * @default 0
   */
  defaultScrollOffset?: number;

  /**
   * Ref used to interact with this component's imperative API.
   *
   * This API has imperative methods for scrolling and a getter for the outermost DOM element.
   *
   * ℹ️ The `useListRef` and `useListCallbackRef` hooks are exported for convenience in TypeScript projects.
   */
  listRef?: Ref<{
    /**
     * Keeps the specified row where it is on screen through changes in row heights, e.g. when the user expands or collapses it.
     * Call this before making the change.
     *
     * By default, the list keeps the first visible row that didn't change height in place,
     * so a row at the top of the list that grows would push the rows above it out of view.
     *
     * ℹ️ Ignored if the row isn't visible when row heights change; only applies to dynamic row heights.
     *
     * @param duration How long (in milliseconds) to keep the row in place; defaults to 1000
     * @param index Index of the row to keep in place (0-based)
     *
     * @throws RangeError if an invalid row index is provided
     */
    anchorRow(config: { duration?: number; index: number }): void;

    /**
     * Outermost HTML element for the list if mounted and null if not mounted.
     */
    get element(): HTMLDivElement | null;

    /**
     * Scrolls the list so that the specified row is visible.
     * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
     * (e.g. `scroll-padding-top` can leave room for a sticky header).
     *
     * Dynamic row heights are measured after rendering;
     * Content that resizes later may require another scrollToRow call.
     *
     * ℹ️ For dynamic height lists, "smooth" scrolling is animated by the list (rather than the browser)
     * so that the destination can be corrected as rows are measured along the way.
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
   *
   * @default 3
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
  ) => ReactElement | null;

  /**
   * Number of items to be rendered in the list.
   */
  rowCount: number;

  /**
   * Row height; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the list's current height (string)
   * - function that returns the row height (in pixels) given an index and `rowProps`
   * - dynamic row height cache returned by the `useDynamicRowHeight` hook
   *
   * ℹ️ Percentage heights can't be resolved during server rendering unless a `defaultHeight` (or a pixel height via the `style` prop) is specified.
   *
   * ℹ️ With dynamic row heights, the list keeps the rows on screen in place when rows above them change height
   * (e.g. as they are measured while scrolling up, or when their content resizes) by adjusting the scroll position.
   * The rows kept in place are those after the first visible row that didn't change height,
   * so rows revealed by scrolling up move out of the way as they're measured.
   * To keep a specific row in place instead (e.g. one the user is expanding), call `anchorRow` before changing it.
   * The scroll position is not adjusted while the list is scrolled to the end (e.g. a chat pinned to the bottom)
   * or while `scrollToRow` is scrolling to a row.
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
   * Lists use the row index as a `key` by default.
   * This prop can provide a custom `key` value.
   *
   * ℹ️ Custom keys can ensure better UX for sortable or filterable lists,
   * particularly if your row components are stateful.
   * Refer to the [React documentation](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) for more info.
   *
   * With dynamic row heights (see `useDynamicRowHeight`), measured heights are stored by key,
   * and the rows on screen are kept in place when rows are inserted or removed above them
   * (e.g. when older messages are loaded at the top of a chat),
   * so don't adjust the scroll position yourself after inserting rows.
   *
   * ⚠️ This function is called for many rows (e.g. to calculate row positions), so it should be cheap,
   * like reading an id: `(index, { items }) => items[index].id`.
   * Keys must be stable: a row's key must not change when other rows are inserted or removed,
   * so don't use the index or a random value.
   *
   * ⚠️ This prop cannot be auto-memoized because it is called during render.
   * It is important to always `useCallback` for this prop; do not use an inline function.
   */
  rowKey?: (index: number, data: RowProps) => React.Key;

  /**
   * Additional props to be passed to the row-rendering component.
   * List will automatically re-render rows when values in this object change.
   *
   * ⚠️ This object must not contain `ariaAttributes`, `index`, or `style` props.
   */
  rowProps: ExcludeForbiddenKeys<RowProps>;

  /**
   * Element that scrolls the list, for lists that scroll along with other content (e.g. the page):
   * - "window" to scroll with the page
   * - an ancestor element that scrolls (e.g. stored with a `useState` ref callback); `null` until it has mounted
   *
   * The list renders at its full height and only renders the rows visible within the scroll element's viewport.
   * Its position within the scroll element is measured whenever it renders, scrolls, or resizes,
   * and whenever content before it is resized, inserted, or removed (e.g. an image loading above the list).
   * - `scrollToRow` scrolls the scroll element
   * - `defaultHeight` is used as the viewport height until the scroll element has been measured (e.g. during server rendering)
   * - percentage row heights are relative to the scroll element's viewport height
   * - `defaultScrollOffset` is ignored
   *
   * ℹ️ While the scroll element is `null`, the list renders the first rows (as it does during server rendering).
   *
   * ⚠️ The list itself doesn't scroll, so its `onScroll` handler isn't called;
   * listen to the scroll element's "scroll" events instead (or use the `useIsScrolling` hook).
   */
  scrollElement?: "window" | HTMLElement | null;

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
   *
   * @default "div"
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
 * Imperative List API.
 *
 * ℹ️ The `useListRef` and `useListCallbackRef` hooks are exported for convenience in TypeScript projects.
 */
export interface ListImperativeAPI {
  /**
   * Keeps the specified row where it is on screen through changes in row heights, e.g. when the user expands or collapses it.
   * Call this before making the change.
   *
   * By default, the list keeps the first visible row that didn't change height in place,
   * so a row at the top of the list that grows would push the rows above it out of view.
   *
   * ℹ️ Ignored if the row isn't visible when row heights change; only applies to dynamic row heights.
   *
   * @param duration How long (in milliseconds) to keep the row in place; defaults to 1000
   * @param index Index of the row to keep in place (0-based)
   *
   * @throws RangeError if an invalid row index is provided
   */
  anchorRow: ({
    duration,
    index
  }: {
    duration?: number;
    index: number;
  }) => void;

  /**
   * Outermost HTML element for the list if mounted and null if not mounted.
   */
  get element(): HTMLDivElement | null;

  /**
   * Scrolls the list so that the specified row is visible.
   * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
   * (e.g. `scroll-padding-top` can leave room for a sticky header).
   *
   * Dynamic row heights are measured after rendering;
   * Content that resizes later may require another scrollToRow call.
   *
   * ℹ️ For dynamic height lists, "smooth" scrolling is animated by the list (rather than the browser)
   * so that the destination can be corrected as rows are measured along the way.
   *
   * @param align Determines the vertical alignment of the element within the list
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
