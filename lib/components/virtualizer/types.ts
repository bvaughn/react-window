import type { Align } from "../../types";
import type { DynamicRowHeight } from "../list/types";

export type VirtualizerOptions = {
  /**
   * Number of items.
   */
  count: number;

  /**
   * Initial scroll offset (in pixels), applied once when the element first mounts with at least one item.
   *
   * ℹ️ Ignored when a `scrollElement` is specified.
   */
  defaultScrollOffset?: number;

  /**
   * Size (in pixels) of the viewport before it has been measured (e.g. during server rendering);
   * this determines how many items are initially rendered.
   */
  defaultSize?: number;

  /**
   * Direction of horizontal content; detected from the element (or its ancestors) by default.
   */
  dir?: "ltr" | "rtl";

  /**
   * Direction that items are laid out in; defaults to "vertical".
   */
  direction?: "horizontal" | "vertical";

  /**
   * Element that scrolls the items or, if a `scrollElement` is specified, the element that contains the items.
   *
   * ℹ️ Item offsets are relative to the start of this element's content.
   */
  element: HTMLElement | null;

  /**
   * Item size; the following formats are supported:
   * - number of pixels (number)
   * - percentage of the viewport's size (string)
   * - function that returns the item size (in pixels) given an index
   * - dynamic row height cache returned by the `useDynamicRowHeight` hook (vertical only);
   *   rendered items must be passed to `measureElement` and specify a `data-index` attribute
   *
   * ℹ️ Sizes are cached until the value of this option changes;
   * memoize functions (e.g. with `useCallback`) and only change them when sizes change.
   */
  itemSize: number | string | ((index: number) => number) | DynamicRowHeight;

  /**
   * Callback notified when the range of visible (or rendered) items changes.
   */
  onItemsRendered?: (
    visibleItems: { startIndex: number; stopIndex: number },
    allItems: { startIndex: number; stopIndex: number }
  ) => void;

  /**
   * How many additional items to render outside of the visible area; defaults to 3.
   */
  overscanCount?: number;

  /**
   * Element that scrolls the items, for items that scroll along with other content (e.g. the page):
   * - "window" to scroll with the page
   * - an ancestor element that scrolls; `null` until it has mounted
   *
   * See the `scrollElement` prop of `List` for more information.
   */
  scrollElement?: "window" | HTMLElement | null;
};

export type VirtualItem = {
  /**
   * Index of the item.
   */
  index: number;

  /**
   * Offset (in pixels) of the item from the start of the element's content.
   */
  offset: number;

  /**
   * Size (in pixels) of the item; an estimate for dynamic sizes that have not yet been measured.
   */
  size: number;
};

export type Virtualizer = {
  /**
   * Items to render (including overscan).
   */
  items: VirtualItem[];

  /**
   * Ref callback for rendered items, required for items with dynamic sizes (see `itemSize`).
   */
  measureElement: (element: Element | null) => void;

  /**
   * Scrolls the element (or scroll element) so that the specified item is visible.
   * Like the browser's `scrollIntoView`, items are aligned within the CSS `scroll-padding` of the element being scrolled
   * (e.g. `scroll-padding-top` can leave room for a sticky header).
   *
   * @throws RangeError if an invalid index is provided
   */
  scrollToIndex: (options: {
    align?: Align;
    behavior?: ScrollBehavior;
    index: number;
  }) => void;

  /**
   * Total size (in pixels) of all items; an estimate for dynamic sizes that have not yet been measured.
   */
  totalSize: number;

  /**
   * Range of items within the visible area (excluding overscan).
   */
  visibleRange: { startIndex: number; stopIndex: number };
};
