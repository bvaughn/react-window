// @flow

import memoizeOne from 'memoize-one';
import { createElement, PureComponent } from 'react';
import { cancelTimeout, requestTimeout } from './timer';
import { getScrollbarSize, normalizeScrollLeft } from './domHelpers';

import type { TimeoutID } from './timer';

type Direction = 'ltr' | 'rtl';
export type ScrollToAlign = 'auto' | 'smart' | 'center' | 'start' | 'end';

type itemSize = number | ((index: number) => number);

type RenderComponentProps<T> = {|
  columnIndex: number,
  data: T,
  isScrolling?: boolean,
  rowIndex: number,
  style: Object,
|};
export type RenderComponent<T> = React$ComponentType<
  $Shape<RenderComponentProps<T>>
>;

type ScrollDirection = 'forward' | 'backward';

type OnItemsRenderedCallback = ({
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number,
}) => void;
type OnScrollCallback = ({
  horizontalScrollDirection: ScrollDirection,
  scrollLeft: number,
  scrollTop: number,
  scrollUpdateWasRequested: boolean,
  verticalScrollDirection: ScrollDirection,
}) => void;

type ScrollEvent = SyntheticEvent<HTMLDivElement>;
type ItemStyleCache = { [key: string]: Object };

export type Props<T> = {|
  children: RenderComponent<T>,
  className?: string,
  columnCount: number,
  columnWidth: itemSize,
  direction: Direction,
  height: number,
  initialScrollLeft?: number,
  initialScrollTop?: number,
  innerRef?: any,
  innerElementType?: React$ElementType,
  innerTagName?: string, // deprecated
  itemData: T,
  itemKey?: (params: {|
    columnIndex: number,
    data: T,
    rowIndex: number,
  |}) => any,
  onItemsRendered?: OnItemsRenderedCallback,
  onScroll?: OnScrollCallback,
  outerRef?: any,
  outerElementType?: React$ElementType,
  outerTagName?: string, // deprecated
  overscanColumnsCount?: number,
  overscanCount?: number, // deprecated
  overscanRowsCount?: number,
  rowCount: number,
  rowHeight: itemSize,
  style?: Object,
  useIsScrolling: boolean,
  width: number,
|};

type State = {|
  instance: any,
  isScrolling: boolean,
  horizontalScrollDirection: ScrollDirection,
  scrollLeft: number,
  normalizedScrollLeft: number,
  scrollTop: number,
  scrollUpdateWasRequested: boolean,
  verticalScrollDirection: ScrollDirection,
|};

type getItemOffset = (
  props: Props<any>,
  index: number,
  instanceProps: any
) => number;
type getItemSize = (
  props: Props<any>,
  index: number,
  instanceProps: any
) => number;
type getEstimatedTotalSize = (props: Props<any>, instanceProps: any) => number;
type GetOffsetForItemAndAlignment = (
  props: Props<any>,
  index: number,
  align: ScrollToAlign,
  scrollOffset: number,
  instanceProps: any,
  scrollbarSize: number
) => number;
type GetStartIndexForOffset = (
  props: Props<any>,
  offset: number,
  instanceProps: any
) => number;
type GetStopIndexForStartIndex = (
  props: Props<any>,
  startIndex: number,
  scrollOffset: number,
  instanceProps: any
) => number;
type InitInstanceProps = (props: Props<any>, instance: any) => any;
type ValidateProps = (props: Props<any>) => void;

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

const defaultItemKey = ({ columnIndex, data, rowIndex }) =>
  `${rowIndex}:${columnIndex}`;

// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
let devWarningsOverscanCount = null;
let devWarningsTagName = null;
if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined' && typeof window.WeakSet !== 'undefined') {
    devWarningsOverscanCount = new WeakSet();
    devWarningsTagName = new WeakSet();
  }
}

export default function createGridComponent({
  getColumnOffset,
  getColumnStartIndexForOffset,
  getColumnStopIndexForStartIndex,
  getColumnWidth,
  getEstimatedTotalHeight,
  getEstimatedTotalWidth,
  getOffsetForColumnAndAlignment,
  getOffsetForRowAndAlignment,
  getRowHeight,
  getRowOffset,
  getRowStartIndexForOffset,
  getRowStopIndexForStartIndex,
  initInstanceProps,
  shouldResetStyleCacheOnItemSizeChange,
  validateProps,
}: {|
  getColumnOffset: getItemOffset,
  getColumnStartIndexForOffset: GetStartIndexForOffset,
  getColumnStopIndexForStartIndex: GetStopIndexForStartIndex,
  getColumnWidth: getItemSize,
  getEstimatedTotalHeight: getEstimatedTotalSize,
  getEstimatedTotalWidth: getEstimatedTotalSize,
  getOffsetForColumnAndAlignment: GetOffsetForItemAndAlignment,
  getOffsetForRowAndAlignment: GetOffsetForItemAndAlignment,
  getRowOffset: getItemOffset,
  getRowHeight: getItemSize,
  getRowStartIndexForOffset: GetStartIndexForOffset,
  getRowStopIndexForStartIndex: GetStopIndexForStartIndex,
  initInstanceProps: InitInstanceProps,
  shouldResetStyleCacheOnItemSizeChange: boolean,
  validateProps: ValidateProps,
|}) {
  return class Grid<T> extends PureComponent<Props<T>, State> {
    _instanceProps: any = initInstanceProps(this.props, this);
    _resetIsScrollingTimeoutId: TimeoutID | null = null;
    _outerRef: ?HTMLDivElement;

    static defaultProps = {
      direction: 'ltr',
      itemData: undefined,
      useIsScrolling: false,
    };

    // Always use explicit constructor for React components.
    // It produces less code after transpilation. (#26)
    // eslint-disable-next-line no-useless-constructor
    constructor(props: Props<T>) {
      super(props);

      const {
        direction,
        width,
        initialScrollLeft,
        initialScrollTop,
      } = this.props;

      const estimatedWidth = getEstimatedTotalWidth(
        this.props,
        this._instanceProps
      );
      const scrollLeft =
        typeof initialScrollLeft === 'number'
          ? initialScrollLeft
          : normalizeScrollLeft({
              direction: direction,
              scrollLeft: 0,
              clientWidth: Math.min(width, estimatedWidth),
              scrollWidth: estimatedWidth,
            });

      const initialNormalizedScrollLeft = normalizeScrollLeft({
        direction: direction,
        scrollLeft: scrollLeft,
        clientWidth: width,
        scrollWidth: estimatedWidth,
      });

      this.state = {
        instance: this,
        isScrolling: false,
        horizontalScrollDirection: 'forward',
        scrollLeft: scrollLeft,
        normalizedScrollLeft: initialNormalizedScrollLeft,
        scrollTop: typeof initialScrollTop === 'number' ? initialScrollTop : 0,
        scrollUpdateWasRequested: false,
        verticalScrollDirection: 'forward',
      };
    }

    static getDerivedStateFromProps(
      nextProps: Props<T>,
      prevState: State
    ): $Shape<State> | null {
      validateSharedProps(nextProps, prevState);
      validateProps(nextProps);
      return null;
    }

    scrollTo({
      scrollLeft,
      scrollTop,
    }: {
      scrollLeft: number,
      scrollTop: number,
    }): void {
      if (scrollTop !== undefined) {
        scrollTop = Math.max(0, scrollTop);
      }

      let normalizedScrollLeft = undefined;

      const { direction, width } = this.props;
      let horizontalScrollDirection = 'backward';
      if (scrollLeft !== undefined) {
        const scrollWidth = getEstimatedTotalWidth(
          this.props,
          this._instanceProps
        );
        normalizedScrollLeft = normalizeScrollLeft({
          direction,
          scrollLeft,
          scrollWidth,
          clientWidth: width,
        });

        if (normalizedScrollLeft < 0) {
          normalizedScrollLeft = 0;

          scrollLeft = normalizeScrollLeft({
            direction,
            scrollLeft: normalizedScrollLeft,
            scrollWidth,
            clientWidth: width,
          });
        }

        horizontalScrollDirection =
          this.state.normalizedScrollLeft < normalizedScrollLeft
            ? 'forward'
            : 'backward';
      }

      this.setState(prevState => {
        if (scrollLeft === undefined) {
          scrollLeft = prevState.scrollLeft;
        }
        if (scrollTop === undefined) {
          scrollTop = prevState.scrollTop;
        }

        if (
          prevState.scrollLeft === scrollLeft &&
          prevState.scrollTop === scrollTop
        ) {
          return null;
        }

        return {
          horizontalScrollDirection: horizontalScrollDirection,
          scrollLeft: scrollLeft,
          normalizedScrollLeft: normalizedScrollLeft,
          scrollTop: scrollTop,
          scrollUpdateWasRequested: true,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? 'forward' : 'backward',
        };
      }, this._resetIsScrollingDebounced);
    }

    scrollToItem({
      align = 'auto',
      columnIndex,
      rowIndex,
    }: {
      align: ScrollToAlign,
      columnIndex?: number,
      rowIndex?: number,
    }): void {
      const { columnCount, height, rowCount, width, direction } = this.props;
      const { scrollLeft, scrollTop, normalizedScrollLeft } = this.state;
      const scrollbarSize = getScrollbarSize();

      if (columnIndex !== undefined) {
        columnIndex = Math.max(0, Math.min(columnIndex, columnCount - 1));
      }
      if (rowIndex !== undefined) {
        rowIndex = Math.max(0, Math.min(rowIndex, rowCount - 1));
      }

      const estimatedTotalHeight = getEstimatedTotalHeight(
        this.props,
        this._instanceProps
      );
      const estimatedTotalWidth = getEstimatedTotalWidth(
        this.props,
        this._instanceProps
      );

      // The scrollbar size should be considered when scrolling an item into view,
      // to ensure it's fully visible.
      // But we only need to account for its size when it's actually visible.
      const horizontalScrollbarSize =
        estimatedTotalWidth > width ? scrollbarSize : 0;
      const verticalScrollbarSize =
        estimatedTotalHeight > height ? scrollbarSize : 0;

      let newNormalizedScrollLeft = normalizedScrollLeft;
      let browserScrollLeft = scrollLeft;
      let horizontalScrollDirection = 'backward';
      if (columnIndex !== undefined) {
        // Determine where we would scroll to if we were in a perfect world.
        newNormalizedScrollLeft = getOffsetForColumnAndAlignment(
          this.props,
          columnIndex,
          align,
          normalizedScrollLeft,
          this._instanceProps,
          verticalScrollbarSize
        );

        // Now we need to determine how large the scrollWidth will be once
        // rendered so we can determine where to actually scroll the browser to.
        // When rendered we overscan by a given number of columns and recalculate
        // how wide the scrolling content should be based on that. We need to do
        // the same here to calculate the scrollLeft
        const startIndex = getColumnStartIndexForOffset(
          this.props,
          newNormalizedScrollLeft,
          this._instanceProps
        );
        const stopIndex = getColumnStopIndexForStartIndex(
          this.props,
          startIndex,
          newNormalizedScrollLeft,
          this._instanceProps
        );

        horizontalScrollDirection =
          normalizedScrollLeft < newNormalizedScrollLeft
            ? 'forward'
            : 'backward';

        const overscanForward =
          horizontalScrollDirection === 'forward'
            ? Math.max(1, this.props.overscanColumnsCount || 1)
            : 1;

        // This will update the index that we've measured up to matching that to what we'd measure once rendered
        getColumnOffset(
          this.props,
          Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)),
          this._instanceProps
        );

        // Re-calculate the estimated width now that we've measured more
        // columns in getColumnOffset above so that we can convert
        // back from a normalized scrollLeft to one the browser understands.
        // This is important as we'll change the width to this new value when
        // rendered. If we use the existing width to calculate where we want the
        // browser to scroll to that value will be incorrect by the time it's happened.
        const newEstimatedTotalWidth = getEstimatedTotalWidth(
          this.props,
          this._instanceProps
        );

        browserScrollLeft = normalizeScrollLeft({
          direction,
          scrollLeft: newNormalizedScrollLeft,
          scrollWidth: newEstimatedTotalWidth,
          clientWidth:
            Math.min(width, newEstimatedTotalWidth) - verticalScrollbarSize,
        });
      }

      const newScrollTop =
        rowIndex !== undefined
          ? getOffsetForRowAndAlignment(
              this.props,
              rowIndex,
              align,
              scrollTop,
              this._instanceProps,
              horizontalScrollbarSize
            )
          : scrollTop;

      this.setState(prevState => {
        if (
          prevState.scrollLeft === browserScrollLeft &&
          prevState.scrollTop === newScrollTop
        ) {
          return null;
        }

        return {
          horizontalScrollDirection: horizontalScrollDirection,
          scrollLeft: browserScrollLeft,
          normalizedScrollLeft: newNormalizedScrollLeft,
          scrollTop: newScrollTop,
          scrollUpdateWasRequested: true,
          verticalScrollDirection:
            prevState.scrollTop < newScrollTop ? 'forward' : 'backward',
        };
      }, this._resetIsScrollingDebounced);
    }

    componentDidMount() {
      const { initialScrollLeft, initialScrollTop } = this.props;
      if (typeof initialScrollLeft === 'number' && this._outerRef != null) {
        ((this._outerRef: any): HTMLDivElement).scrollLeft = initialScrollLeft;
      }
      if (typeof initialScrollTop === 'number' && this._outerRef != null) {
        ((this._outerRef: any): HTMLDivElement).scrollTop = initialScrollTop;
      }

      this._callPropsCallbacks();
    }

    componentDidUpdate() {
      const { scrollLeft, scrollTop, scrollUpdateWasRequested } = this.state;
      if (scrollUpdateWasRequested && this._outerRef !== null) {
        ((this._outerRef: any): HTMLDivElement).scrollLeft = scrollLeft;
        ((this._outerRef: any): HTMLDivElement).scrollTop = scrollTop;

        const { direction, width, height } = this.props;
        const scrollbarSize = getScrollbarSize();

        // Now that scrollLeft has changed programmatically we need to update the normalized version of this
        // We can't calculate it before now because we may have changed the scrollWidth of the component as
        // a result of measuring more elements and we need that to calculate a normalized version.

        // The scrollbar size should be considered when scrolling an item into view,
        // to ensure it's fully visible.
        // But we only need to account for its size when it's actually visible.
        const verticalScrollbarSize =
          ((this._outerRef: any): HTMLDivElement).scrollHeight > height
            ? scrollbarSize
            : 0;

        const normalizedScrollLeft = normalizeScrollLeft({
          direction,
          scrollLeft: scrollLeft,
          scrollWidth: ((this._outerRef: any): HTMLDivElement).scrollWidth,
          clientWidth: width - verticalScrollbarSize,
        });

        this.setState({
          normalizedScrollLeft,
        });
      }

      this._callPropsCallbacks();
    }

    componentWillUnmount() {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }
    }

    render() {
      const {
        children,
        className,
        columnCount,
        direction,
        height,
        innerRef,
        innerElementType,
        innerTagName,
        itemData,
        itemKey = defaultItemKey,
        outerElementType,
        outerTagName,
        rowCount,
        style,
        useIsScrolling,
        width,
      } = this.props;
      const { isScrolling } = this.state;

      const [
        columnStartIndex,
        columnStopIndex,
      ] = this._getHorizontalRangeToRender();
      const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();

      const items = [];
      if (columnCount > 0 && rowCount) {
        for (
          let rowIndex = rowStartIndex;
          rowIndex <= rowStopIndex;
          rowIndex++
        ) {
          for (
            let columnIndex = columnStartIndex;
            columnIndex <= columnStopIndex;
            columnIndex++
          ) {
            items.push(
              createElement(children, {
                columnIndex,
                data: itemData,
                isScrolling: useIsScrolling ? isScrolling : undefined,
                key: itemKey({ columnIndex, data: itemData, rowIndex }),
                rowIndex,
                style: this._getItemStyle(rowIndex, columnIndex),
              })
            );
          }
        }
      }

      // Read this value AFTER items have been created,
      // So their actual sizes (if variable) are taken into consideration.
      const estimatedTotalHeight = getEstimatedTotalHeight(
        this.props,
        this._instanceProps
      );
      const estimatedTotalWidth = getEstimatedTotalWidth(
        this.props,
        this._instanceProps
      );

      return createElement(
        outerElementType || outerTagName || 'div',
        {
          className,
          onScroll: this._onScroll,
          ref: this._outerRefSetter,
          style: {
            position: 'relative',
            height,
            width,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            willChange: 'transform',
            direction,
            ...style,
          },
        },
        createElement(innerElementType || innerTagName || 'div', {
          children: items,
          ref: innerRef,
          style: {
            height: estimatedTotalHeight,
            pointerEvents: isScrolling ? 'none' : undefined,
            width: estimatedTotalWidth,
          },
        })
      );
    }

    _callOnItemsRendered: (
      overscanColumnStartIndex: number,
      overscanColumnStopIndex: number,
      overscanRowStartIndex: number,
      overscanRowStopIndex: number,
      visibleColumnStartIndex: number,
      visibleColumnStopIndex: number,
      visibleRowStartIndex: number,
      visibleRowStopIndex: number
    ) => void;
    _callOnItemsRendered = memoizeOne(
      (
        overscanColumnStartIndex: number,
        overscanColumnStopIndex: number,
        overscanRowStartIndex: number,
        overscanRowStopIndex: number,
        visibleColumnStartIndex: number,
        visibleColumnStopIndex: number,
        visibleRowStartIndex: number,
        visibleRowStopIndex: number
      ) =>
        ((this.props.onItemsRendered: any): OnItemsRenderedCallback)({
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex,
        })
    );

    _callOnScroll: (
      scrollLeft: number,
      scrollTop: number,
      horizontalScrollDirection: ScrollDirection,
      verticalScrollDirection: ScrollDirection,
      scrollUpdateWasRequested: boolean
    ) => void;
    _callOnScroll = memoizeOne(
      (
        scrollLeft: number,
        scrollTop: number,
        horizontalScrollDirection: ScrollDirection,
        verticalScrollDirection: ScrollDirection,
        scrollUpdateWasRequested: boolean
      ) =>
        ((this.props.onScroll: any): OnScrollCallback)({
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          verticalScrollDirection,
          scrollUpdateWasRequested,
        })
    );

    _callPropsCallbacks() {
      const { columnCount, onItemsRendered, onScroll, rowCount } = this.props;
      if (typeof onItemsRendered === 'function') {
        if (columnCount > 0 && rowCount > 0) {
          const [
            overscanColumnStartIndex,
            overscanColumnStopIndex,
            visibleColumnStartIndex,
            visibleColumnStopIndex,
          ] = this._getHorizontalRangeToRender();
          const [
            overscanRowStartIndex,
            overscanRowStopIndex,
            visibleRowStartIndex,
            visibleRowStopIndex,
          ] = this._getVerticalRangeToRender();
          this._callOnItemsRendered(
            overscanColumnStartIndex,
            overscanColumnStopIndex,
            overscanRowStartIndex,
            overscanRowStopIndex,
            visibleColumnStartIndex,
            visibleColumnStopIndex,
            visibleRowStartIndex,
            visibleRowStopIndex
          );
        }
      }

      if (typeof onScroll === 'function') {
        const {
          horizontalScrollDirection,
          scrollLeft,
          scrollTop,
          scrollUpdateWasRequested,
          verticalScrollDirection,
        } = this.state;
        this._callOnScroll(
          scrollLeft,
          scrollTop,
          horizontalScrollDirection,
          verticalScrollDirection,
          scrollUpdateWasRequested
        );
      }
    }

    // Lazily create and cache item styles while scrolling,
    // So that pure component sCU will prevent re-renders.
    // We maintain this cache, and pass a style prop rather than index,
    // So that List can clear cached styles and force item re-render if necessary.
    _getItemStyle: (rowIndex: number, columnIndex: number) => Object;
    _getItemStyle = (rowIndex: number, columnIndex: number): Object => {
      const { columnWidth, direction, rowHeight } = this.props;

      const itemStyleCache = this._getItemStyleCache(
        shouldResetStyleCacheOnItemSizeChange && columnWidth,
        shouldResetStyleCacheOnItemSizeChange && direction,
        shouldResetStyleCacheOnItemSizeChange && rowHeight
      );

      const key = `${rowIndex}:${columnIndex}`;

      let style;
      if (itemStyleCache.hasOwnProperty(key)) {
        style = itemStyleCache[key];
      } else {
        itemStyleCache[key] = style = {
          position: 'absolute',
          [direction === 'rtl' ? 'right' : 'left']: getColumnOffset(
            this.props,
            columnIndex,
            this._instanceProps
          ),
          top: getRowOffset(this.props, rowIndex, this._instanceProps),
          height: getRowHeight(this.props, rowIndex, this._instanceProps),
          width: getColumnWidth(this.props, columnIndex, this._instanceProps),
        };
      }

      return style;
    };

    _getItemStyleCache: (_: any, __: any, ___: any) => ItemStyleCache;
    _getItemStyleCache = memoizeOne((_: any, __: any, ___: any) => ({}));

    _getHorizontalRangeToRender(): [number, number, number, number] {
      const {
        columnCount,
        overscanColumnsCount,
        overscanCount,
        rowCount,
      } = this.props;
      const {
        horizontalScrollDirection,
        isScrolling,
        normalizedScrollLeft,
      } = this.state;

      const overscanCountResolved: number =
        overscanColumnsCount || overscanCount || 1;

      if (columnCount === 0 || rowCount === 0) {
        return [0, 0, 0, 0];
      }

      const startIndex = getColumnStartIndexForOffset(
        this.props,
        normalizedScrollLeft,
        this._instanceProps
      );
      const stopIndex = getColumnStopIndexForStartIndex(
        this.props,
        startIndex,
        normalizedScrollLeft,
        this._instanceProps
      );

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      const overscanBackward =
        !isScrolling || horizontalScrollDirection === 'backward'
          ? Math.max(1, overscanCountResolved)
          : 1;
      const overscanForward =
        !isScrolling || horizontalScrollDirection === 'forward'
          ? Math.max(1, overscanCountResolved)
          : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex,
      ];
    }

    _getVerticalRangeToRender(): [number, number, number, number] {
      const {
        columnCount,
        overscanCount,
        overscanRowsCount,
        rowCount,
      } = this.props;
      const { isScrolling, verticalScrollDirection, scrollTop } = this.state;

      const overscanCountResolved: number =
        overscanRowsCount || overscanCount || 1;

      if (columnCount === 0 || rowCount === 0) {
        return [0, 0, 0, 0];
      }

      const startIndex = getRowStartIndexForOffset(
        this.props,
        scrollTop,
        this._instanceProps
      );
      const stopIndex = getRowStopIndexForStartIndex(
        this.props,
        startIndex,
        scrollTop,
        this._instanceProps
      );

      // Overscan by one item in each direction so that tab/focus works.
      // If there isn't at least one extra item, tab loops back around.
      const overscanBackward =
        !isScrolling || verticalScrollDirection === 'backward'
          ? Math.max(1, overscanCountResolved)
          : 1;
      const overscanForward =
        !isScrolling || verticalScrollDirection === 'forward'
          ? Math.max(1, overscanCountResolved)
          : 1;

      return [
        Math.max(0, startIndex - overscanBackward),
        Math.max(0, Math.min(rowCount - 1, stopIndex + overscanForward)),
        startIndex,
        stopIndex,
      ];
    }

    _onScroll = (event: ScrollEvent): void => {
      const {
        clientWidth,
        scrollLeft,
        scrollTop,
        scrollWidth,
      } = event.currentTarget;
      this.setState(prevState => {
        if (
          prevState.scrollLeft === scrollLeft &&
          prevState.scrollTop === scrollTop
        ) {
          // Scroll position may have been updated by cDM/cDU,
          // In which case we don't need to trigger another render,
          // And we don't want to update state.isScrolling.
          return null;
        }

        const normalizedScrollLeft = normalizeScrollLeft({
          direction: this.props.direction,
          scrollLeft,
          clientWidth,
          scrollWidth,
        });

        return {
          isScrolling: true,
          horizontalScrollDirection:
            prevState.normalizedScrollLeft < normalizedScrollLeft
              ? 'forward'
              : 'backward',
          scrollLeft,
          scrollTop,
          normalizedScrollLeft,
          verticalScrollDirection:
            prevState.scrollTop < scrollTop ? 'forward' : 'backward',
          scrollUpdateWasRequested: false,
        };
      }, this._resetIsScrollingDebounced);
    };

    _outerRefSetter = (ref: any): void => {
      const { outerRef } = this.props;

      this._outerRef = ((ref: any): HTMLDivElement);

      if (typeof outerRef === 'function') {
        outerRef(ref);
      } else if (
        outerRef != null &&
        typeof outerRef === 'object' &&
        outerRef.hasOwnProperty('current')
      ) {
        outerRef.current = ref;
      }
    };

    _resetIsScrollingDebounced = () => {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }

      this._resetIsScrollingTimeoutId = requestTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      );
    };

    _resetIsScrolling = () => {
      this._resetIsScrollingTimeoutId = null;

      this.setState({ isScrolling: false }, () => {
        // Clear style cache after state update has been committed.
        // This way we don't break pure sCU for items that don't use isScrolling param.
        this._getItemStyleCache(-1);
      });
    };
  };
}

const validateSharedProps = (
  {
    children,
    direction,
    height,
    innerTagName,
    outerTagName,
    overscanCount,
    width,
  }: Props<any>,
  { instance }: State
): void => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof overscanCount === 'number') {
      if (devWarningsOverscanCount && !devWarningsOverscanCount.has(instance)) {
        devWarningsOverscanCount.add(instance);
        console.warn(
          'The overscanCount prop has been deprecated. ' +
            'Please use the overscanColumnsCount and overscanRowsCount props instead.'
        );
      }
    }

    if (innerTagName != null || outerTagName != null) {
      if (devWarningsTagName && !devWarningsTagName.has(instance)) {
        devWarningsTagName.add(instance);
        console.warn(
          'The innerTagName and outerTagName props have been deprecated. ' +
            'Please use the innerElementType and outerElementType props instead.'
        );
      }
    }

    if (children == null) {
      throw Error(
        'An invalid "children" prop has been specified. ' +
          'Value should be a React component. ' +
          `"${children === null ? 'null' : typeof children}" was specified.`
      );
    }

    switch (direction) {
      case 'ltr':
      case 'rtl':
        // Valid values
        break;
      default:
        throw Error(
          'An invalid "direction" prop has been specified. ' +
            'Value should be either "ltr" or "rtl". ' +
            `"${direction}" was specified.`
        );
    }

    if (typeof width !== 'number') {
      throw Error(
        'An invalid "width" prop has been specified. ' +
          'Grids must specify a number for width. ' +
          `"${width === null ? 'null' : typeof width}" was specified.`
      );
    }

    if (typeof height !== 'number') {
      throw Error(
        'An invalid "height" prop has been specified. ' +
          'Grids must specify a number for height. ' +
          `"${height === null ? 'null' : typeof height}" was specified.`
      );
    }
  }
};
