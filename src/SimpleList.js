// @flow

import memoizeOne from 'memoize-one';
import { createElement, PureComponent } from 'react';
import { cancelTimeout, requestTimeout } from './timer';

import type { TimeoutID } from './timer';

export type ScrollToAlign = 'center' | 'minimum' | 'smart' | 'start' | 'end';

type Style = {
  [string]: mixed,
};

type itemRendererFn = ({|
  index: number,
  key: string | number,
  style: Style,
|}) => React$Node;

type onItemsDisplayedFn = (startIndex: number, stopIndex: number) => void;

type ScrollEvent = SyntheticEvent<HTMLElement>;

type ItemStyleCache = { [index: number]: Style };

type OuterProps = {|
  children: React$Node,
  className: string | void,
  onScroll: ScrollEvent => void,
  style: Style,
|};

type InnerProps = {|
  children: React$Node,
  style: Style,
|};

export type Props = {|
  className?: string,
  height: number,
  initialScrollOffset?: number,
  innerRef?: any,
  innerElementType?: string | React$AbstractComponent<InnerProps, any>,
  itemCount: number,
  itemKey?: (index: number) => string | number,
  itemRenderer: itemRendererFn,
  itemSize: number,
  onItemsDisplayed?: onItemsDisplayedFn,
  onScroll?: ScrollEvent => void,
  outerRef?: any,
  outerElementType?: string | React$AbstractComponent<OuterProps, any>,
  style?: Object,
  width: number | string,
|};

type State = {|
  scrollTop: number,
  scrollUpdateWasRequested: boolean,
  startIndex: number,
  stopIndex: number,
|};

const defaultItemKey = (index: number) => index;

const RESET_POINTER_EVENTS_DEBOUNCE_INTERVAL = 150;

export default class List extends PureComponent<Props, State> {
  _innerRef: ?HTMLElement;
  _outerRef: ?HTMLElement;
  _resetPointerEventsTimeoutID: TimeoutID | null = null;

  // Always use explicit constructor for React components.
  // It produces less code after transpilation. (#26)
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);

    const scrollTop =
      typeof this.props.initialScrollOffset === 'number'
        ? this.props.initialScrollOffset
        : 0;

    const [startIndex, stopIndex] = this._getRangeToRender(scrollTop);

    this.state = {
      scrollTop,
      scrollUpdateWasRequested: false,
      startIndex,
      stopIndex,
    };
  }

  scrollTo(scrollTop: number): void {
    scrollTop = Math.max(0, scrollTop);

    this.setState(prevState => {
      if (prevState.scrollTop === scrollTop) {
        return null;
      }

      const [startIndex, stopIndex] = this._getRangeToRender(scrollTop);

      return {
        scrollTop: scrollTop,
        scrollUpdateWasRequested: true,
        startIndex,
        stopIndex,
      };
    });
  }

  scrollToItem(index: number, align: ?ScrollToAlign = 'smart'): void {
    const { height, itemCount, itemSize } = this.props;
    const { scrollTop } = this.state;

    index = Math.max(0, Math.min(index, itemCount - 1));

    const lastItemOffset = Math.max(0, itemCount * itemSize - height);
    const maxOffset = Math.min(lastItemOffset, index * itemSize);
    const minOffset = Math.max(0, index * itemSize - height + itemSize);

    if (align === 'smart') {
      if (scrollTop >= minOffset - height && scrollTop <= maxOffset + height) {
        align = 'minimum';
      } else {
        align = 'center';
      }
    }

    switch (align) {
      case 'start':
        this.scrollTo(maxOffset);
        break;
      case 'end':
        this.scrollTo(minOffset);
        break;
      case 'center':
        // "Centered" offset is usually the average of the min and max.
        // But near the edges of the list, this doesn't hold true.
        const middleOffset = Math.round(
          minOffset + (maxOffset - minOffset) / 2
        );
        if (middleOffset < Math.ceil(height / 2)) {
          this.scrollTo(0); // near the beginning
        } else if (middleOffset > lastItemOffset + Math.floor(height / 2)) {
          this.scrollTo(lastItemOffset); // near the end
        } else {
          this.scrollTo(middleOffset);
        }
        break;
      case 'minimum':
      default:
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          this.scrollTo(scrollTop);
        } else if (scrollTop < minOffset) {
          this.scrollTo(minOffset);
        } else {
          this.scrollTo(maxOffset);
        }
        break;
    }
  }

  componentDidMount() {
    const { initialScrollOffset } = this.props;
    const { startIndex, stopIndex } = this.state;

    if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
      const outerRef = ((this._outerRef: any): HTMLElement);
      outerRef.scrollTop = initialScrollOffset;
    }

    this._callOnItemsDisplayed(startIndex, stopIndex);
    this._resetPointerEventsDebounced();
  }

  componentDidUpdate() {
    const {
      scrollTop,
      scrollUpdateWasRequested,
      startIndex,
      stopIndex,
    } = this.state;

    if (scrollUpdateWasRequested && this._outerRef != null) {
      const outerRef = ((this._outerRef: any): HTMLElement);
      outerRef.scrollTop = scrollTop;
    }

    this._callOnItemsDisplayed(startIndex, stopIndex);
    this._resetPointerEventsDebounced();
  }

  componentWillUnmount() {
    if (this._resetPointerEventsTimeoutID !== null) {
      cancelTimeout(this._resetPointerEventsTimeoutID);
    }
  }

  render() {
    const {
      className,
      height,
      innerElementType,
      itemCount,
      itemKey = defaultItemKey,
      itemSize,
      itemRenderer,
      outerElementType,
      style,
      width,
    } = this.props;
    const { startIndex, stopIndex } = this.state;

    const items = [];
    if (itemCount > 0) {
      const itemStyleCache = this._getItemStyleCache(itemSize);

      for (let index = startIndex; index <= stopIndex; index++) {
        let style;
        if (itemStyleCache.hasOwnProperty(index)) {
          style = itemStyleCache[index];
        } else {
          itemStyleCache[index] = style = {
            position: 'absolute',
            left: 0,
            top: index * itemSize,
            height: itemSize,
            width: '100%',
          };
        }

        items.push(
          itemRenderer({
            key: itemKey(index),
            index,
            style,
          })
        );
      }
    }

    return createElement(
      outerElementType || 'div',
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
          ...style,
        },
      },
      createElement(innerElementType || 'div', {
        children: items,
        ref: this._innerRefSetter,
        style: {
          height: itemSize * itemCount,
          pointerEvents: 'none',
          width: '100%',
        },
      })
    );
  }

  _callOnItemsDisplayed: (startIndex: number, stopIndex: number) => void;
  _callOnItemsDisplayed = memoizeOne(
    (startIndex: number, stopIndex: number) => {
      const { onItemsDisplayed } = this.props;
      if (typeof onItemsDisplayed === 'function') {
        onItemsDisplayed(startIndex, stopIndex);
      }
    }
  );

  // Lazily create and cache item styles while scrolling,
  // So that pure component sCU will prevent re-renders.
  // We maintain this cache, and pass a style prop rather than index,
  // So that List can clear cached styles and force item re-render if necessary

  _getItemStyleCache: (itemSize: number) => ItemStyleCache;
  _getItemStyleCache = memoizeOne((itemSize: number) => ({}));

  _getRangeToRender(scrollTop: number): [number, number] {
    const { height, itemCount, itemSize } = this.props;

    if (itemCount === 0) {
      return [0, 0];
    }

    const startIndex = Math.max(
      0,
      Math.min(itemCount - 1, Math.floor(scrollTop / itemSize))
    );

    const firstItemOffset = startIndex * itemSize;
    const numVisibleItems = Math.ceil(
      (height + scrollTop - firstItemOffset) / itemSize
    );
    const stopIndex = Math.max(
      0,
      Math.min(
        itemCount - 1,
        startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
      )
    );

    // Overscan by one item in each direction so that tab/focus works.
    // If there isn't at least one extra item, tab loops back around.
    return [
      Math.max(0, startIndex - 1),
      Math.max(0, Math.min(itemCount - 1, stopIndex + 1)),
    ];
  }

  _innerRefSetter = (ref: any): void => {
    const { innerRef } = this.props;

    this._innerRef = ((ref: any): HTMLElement);

    if (typeof innerRef === 'function') {
      innerRef(ref);
    } else if (
      innerRef != null &&
      typeof innerRef === 'object' &&
      innerRef.hasOwnProperty('current')
    ) {
      innerRef.current = ref;
    }
  };

  _onScroll = (event: ScrollEvent): void => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const { onScroll } = this.props;

    if (typeof onScroll === 'function') {
      onScroll(event);
    }

    this.setState(prevState => {
      // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
      const maxScrollOffset = Math.min(scrollTop, scrollHeight - clientHeight);
      const safeScrollTop = Math.max(0, maxScrollOffset);

      if (prevState.scrollTop === safeScrollTop) {
        // Scroll position may have been updated by cDM/cDU,
        // In which case we don't need to trigger another render,
        return null;
      }

      const [startIndex, stopIndex] = this._getRangeToRender(safeScrollTop);

      return {
        scrollTop: safeScrollTop,
        scrollUpdateWasRequested: false,
        startIndex,
        stopIndex,
      };
    });
  };

  _outerRefSetter = (ref: any): void => {
    const { outerRef } = this.props;

    this._outerRef = ((ref: any): HTMLElement);

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

  _resetPointerEventsDebounced = () => {
    if (this._resetPointerEventsTimeoutID !== null) {
      cancelTimeout(this._resetPointerEventsTimeoutID);
    }

    this._resetPointerEventsTimeoutID = requestTimeout(
      this._resetPointerEvents,
      RESET_POINTER_EVENTS_DEBOUNCE_INTERVAL
    );
  };

  _resetPointerEvents = () => {
    this._resetPointerEventsTimeoutID = null;

    // Resetting pointer events doesn't require a cascading render.
    if (
      this._innerRef != null &&
      this._innerRef.style.pointerEvents === 'none'
    ) {
      this._innerRef.style.pointerEvents = 'auto';
    }

    // Clear style cache after scrolling has stopped.
    // This enables us to cache during the most perfrormance sensitive times (when scrolling)
    // while also preventing the cache from growing unbounded.
    this._getItemStyleCache(-1);
  };
}
