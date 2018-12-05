import React, { createRef, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import { FixedSizeList } from '..';

const simulateScroll = (instance, scrollOffset, direction = 'vertical') => {
  if (direction === 'horizontal') {
    instance._outerRef.scrollLeft = scrollOffset;
  } else {
    instance._outerRef.scrollTop = scrollOffset;
  }
  ReactTestUtils.Simulate.scroll(instance._outerRef);
};

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('FixedSizeList', () => {
  let itemRenderer, defaultProps, onItemsRendered;

  // Use PureComponent to test memoization.
  // Pass through to itemRenderer mock for easier test assertions.
  class PureItemRenderer extends PureComponent {
    render() {
      return itemRenderer(this.props);
    }
  }

  beforeEach(() => {
    jest.useFakeTimers();

    onItemsRendered = jest.fn();

    itemRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    defaultProps = {
      children: PureItemRenderer,
      height: 100,
      itemCount: 100,
      itemSize: 25,
      onItemsRendered,
      width: 50,
    };
  });

  it('should render an empty list', () => {
    ReactTestRenderer.create(<FixedSizeList {...defaultProps} itemCount={0} />);
    expect(itemRenderer).not.toHaveBeenCalled();
    expect(onItemsRendered).not.toHaveBeenCalled();
  });

  it('should render a list of rows', () => {
    ReactTestRenderer.create(<FixedSizeList {...defaultProps} />);
    expect(itemRenderer).toHaveBeenCalledTimes(7);
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should render a list of columns', () => {
    ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} direction="horizontal" />
    );
    expect(itemRenderer).toHaveBeenCalledTimes(5);
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  describe('scrollbar handling', () => {
    it('should set width to "100%" for vertical lists to avoid unnecessary horizontal scrollbar', () => {
      const innerRef = createRef();
      ReactDOM.render(
        <FixedSizeList {...defaultProps} innerRef={innerRef} />,
        document.createElement('div')
      );
      const style = innerRef.current.style;
      expect(style.width).toBe('100%');
      expect(style.height).toBe('2500px');
    });

    it('should set height to "100%" for horizontal lists to avoid unnecessary vertical scrollbar', () => {
      const innerRef = createRef();
      ReactDOM.render(
        <FixedSizeList
          {...defaultProps}
          direction="horizontal"
          innerRef={innerRef}
        />,
        document.createElement('div')
      );
      const style = innerRef.current.style;
      expect(style.width).toBe('2500px');
      expect(style.height).toBe('100%');
    });
  });

  describe('style caching', () => {
    it('should cache styles while scrolling to avoid breaking pure sCU for items', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} />
      );
      // Scroll a few times.
      // Each time, make sure to render item 3.
      rendered.getInstance().scrollToItem(1, 'start');
      rendered.getInstance().scrollToItem(2, 'start');
      rendered.getInstance().scrollToItem(3, 'start');
      // Find all of the times item 3 was rendered.
      // If we are caching props correctly, it should only be once.
      expect(
        itemRenderer.mock.calls.filter(([params]) => params.index === 3)
      ).toHaveLength(1);
    });

    it('should reset cached styles when scrolling stops', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      // Scroll, then capture the rendered style for item 1,
      // Then let the debounce timer clear the cached styles.
      simulateScroll(instance, 251);
      const itemOneArgsA = itemRenderer.mock.calls.find(
        ([params]) => params.index === 1
      );
      jest.runAllTimers();
      itemRenderer.mockClear();
      // Scroll again, then capture the rendered style for item 1,
      // And confirm that the style was recreated.
      simulateScroll(instance, 0);
      const itemOneArgsB = itemRenderer.mock.calls.find(
        ([params]) => params.index === 1
      );
      expect(itemOneArgsA[0].style).not.toBe(itemOneArgsB[0].style);
    });
  });

  it('changing itemSize updates the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    rendered.update(<FixedSizeList {...defaultProps} itemSize={50} />);
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('changing itemSize updates the rendered items and busts the style cache', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    const oldStyle = itemRenderer.mock.calls[0][0].style;
    itemRenderer.mockClear();
    rendered.update(<FixedSizeList {...defaultProps} itemSize={50} />);
    expect(itemRenderer).toHaveBeenCalled();
    const newStyle = itemRenderer.mock.calls[0][0].style;
    expect(oldStyle).not.toBe(newStyle);
  });

  it('should support momentum scrolling on iOS devices', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    expect(rendered.toJSON().props.style.WebkitOverflowScrolling).toBe('touch');
  });

  it('should disable pointer events while scrolling', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    const scrollContainer = findScrollContainer(rendered);
    expect(scrollContainer.props.style.pointerEvents).toBe('');
    rendered.getInstance().setState({ isScrolling: true });
    expect(scrollContainer.props.style.pointerEvents).toBe('none');
  });

  describe('style overrides', () => {
    it('should support className prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} className="custom" />
      );
      expect(rendered.toJSON().props.className).toBe('custom');
    });

    it('should support style prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} style={{ backgroundColor: 'red' }} />
      );
      expect(rendered.toJSON().props.style.backgroundColor).toBe('red');
    });
  });

  describe('overscanCount', () => {
    it('should require a minimum of 1 overscan to support tabbing', () => {
      ReactTestRenderer.create(
        <FixedSizeList
          {...defaultProps}
          initialScrollOffset={50}
          overscanCount={0}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should accommodate a custom overscan', () => {
      ReactTestRenderer.create(
        <FixedSizeList
          {...defaultProps}
          initialScrollOffset={50}
          overscanCount={2}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should overscan in the direction being scrolled', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList
          {...defaultProps}
          initialScrollOffset={50}
          overscanCount={2}
        />
      );
      rendered.getInstance().scrollTo(100);
      rendered.getInstance().scrollTo(50);
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the beginning of the list', () => {
      ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} initialScrollOffset={0} />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the end of the list', () => {
      ReactTestRenderer.create(
        <FixedSizeList
          {...defaultProps}
          itemCount={10}
          initialScrollOffset={150}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('useIsScrolling', () => {
    it('should not pass an isScrolling param to children unless requested', () => {
      ReactTestRenderer.create(<FixedSizeList {...defaultProps} />);
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(undefined);
    });

    it('should pass an isScrolling param to children if requested', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
      itemRenderer.mockClear();
      simulateScroll(instance, 100);
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(true);
      itemRenderer.mockClear();
      jest.runAllTimers();
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });

    it('should not re-render children unnecessarily if isScrolling param is not used', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} />,
        document.createElement('div')
      );
      simulateScroll(instance, 100);
      itemRenderer.mockClear();
      jest.runAllTimers();
      expect(itemRenderer).not.toHaveBeenCalled();
    });
  });

  describe('scrollTo method', () => {
    it('should not report isScrolling', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      itemRenderer.mockClear();
      instance.scrollTo(100);
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });
  });

  describe('scrollToItem method', () => {
    it('should not set invalid offsets when the list contains few items', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} itemCount={3} onScroll={onScroll} />
      );
      onScroll.mockClear();
      // Offset should not be negative.
      rendered.getInstance().scrollToItem(0);
      expect(onScroll).toHaveBeenCalledWith({
        scrollDirection: 'backward',
        scrollOffset: 0,
        scrollUpdateWasRequested: true,
      });
    });

    it('should scroll to the correct item for align = "auto"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered.getInstance().scrollToItem(10, 'auto');
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered.getInstance().scrollToItem(9, 'auto');
      // Scroll up enough to show item 2 at the top.
      rendered.getInstance().scrollToItem(2, 'auto');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "start"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the top.
      rendered.getInstance().scrollToItem(10, 'start');
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'start');
      // Item 99 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(99, 'start');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered.getInstance().scrollToItem(10, 'end');
      // Scroll back up so that item 9 is at the bottom.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'end');
      // Item 1 can't align at the bottom because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(1, 'end');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "center"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} />
      );
      // Scroll down enough to show item 10 in the middle.
      rendered.getInstance().scrollToItem(10, 'center');
      // Scroll back up so that item 9 is in the middle.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'center');
      // Item 1 can't align in the middle because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(1, 'center');
      // Item 99 can't align in the middle because it's too close to the end.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(99, 'center');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not report isScrolling', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      itemRenderer.mockClear();
      instance.scrollToItem(15);
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });
  });

  // onItemsRendered is pretty well covered by other snapshot tests
  describe('onScroll', () => {
    it('should call onScroll after mount', () => {
      const onScroll = jest.fn();
      ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} onScroll={onScroll} />
      );
      expect(onScroll.mock.calls).toMatchSnapshot();
    });

    it('should call onScroll when scroll position changes', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} onScroll={onScroll} />
      );
      rendered.getInstance().scrollTo(100);
      rendered.getInstance().scrollTo(0);
      expect(onScroll.mock.calls).toMatchSnapshot();
    });

    it('should distinguish between "onScroll" events and scrollTo() calls', () => {
      const onScroll = jest.fn();
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} onScroll={onScroll} />,
        document.createElement('div')
      );

      onScroll.mockClear();
      instance.scrollTo(100);
      expect(onScroll.mock.calls[0][0].scrollUpdateWasRequested).toBe(true);

      onScroll.mockClear();
      simulateScroll(instance, 200);
      expect(onScroll.mock.calls[0][0].scrollUpdateWasRequested).toBe(false);
    });
  });

  describe('itemKey', () => {
    it('should be used', () => {
      const itemKey = jest.fn(index => index);
      ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} itemCount={3} itemKey={itemKey} />
      );
      expect(itemKey).toHaveBeenCalledTimes(3);
      expect(itemKey.mock.calls[0][0]).toBe(0);
      expect(itemKey.mock.calls[1][0]).toBe(1);
      expect(itemKey.mock.calls[2][0]).toBe(2);
    });

    it('should allow items to be moved within the collection without causing caching problems', () => {
      const keyMap = ['0', '1', '2'];
      const keyMapItemRenderer = jest.fn(({ index, style }) => (
        <div style={style}>{keyMap[index]}</div>
      ));
      class ItemRenderer extends PureComponent {
        render() {
          return keyMapItemRenderer(this.props);
        }
      }
      const itemKey = jest.fn(index => keyMap[index]);
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} itemCount={3} itemKey={itemKey}>
          {ItemRenderer}
        </FixedSizeList>
      );
      expect(itemKey).toHaveBeenCalledTimes(3);
      itemKey.mockClear();

      expect(keyMapItemRenderer).toHaveBeenCalledTimes(3);
      keyMapItemRenderer.mockClear();

      // Simulate swapping the first and last items.
      keyMap[0] = '2';
      keyMap[2] = '0';

      rendered.getInstance().forceUpdate();

      // Our key getter should be called again for each key.
      // Since we've modified the map, the first and last key will swap.
      expect(itemKey).toHaveBeenCalledTimes(3);

      // The first and third item have swapped place,
      // So they should have been re-rendered,
      // But the second item should not.
      expect(keyMapItemRenderer).toHaveBeenCalledTimes(2);
      expect(keyMapItemRenderer.mock.calls[0][0].index).toBe(0);
      expect(keyMapItemRenderer.mock.calls[1][0].index).toBe(2);
    });

    it('should receive a data value if itemData is provided', () => {
      const itemKey = jest.fn(index => index);
      const itemData = {};
      ReactTestRenderer.create(
        <FixedSizeList
          {...defaultProps}
          itemData={itemData}
          itemKey={itemKey}
        />
      );
      expect(itemKey).toHaveBeenCalled();
      expect(
        itemKey.mock.calls.filter(([index, data]) => data === itemData)
      ).toHaveLength(itemKey.mock.calls.length);
    });
  });

  describe('refs', () => {
    it('should pass through innerRef and outerRef ref functions', () => {
      const innerRef = jest.fn();
      const outerRef = jest.fn();
      ReactDOM.render(
        <FixedSizeList
          {...defaultProps}
          innerRef={innerRef}
          outerRef={outerRef}
        />,
        document.createElement('div')
      );
      expect(innerRef).toHaveBeenCalled();
      expect(innerRef.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
      expect(outerRef).toHaveBeenCalled();
      expect(outerRef.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });

    it('should pass through innerRef and outerRef createRef objects', () => {
      const innerRef = createRef();
      const outerRef = createRef();
      ReactDOM.render(
        <FixedSizeList
          {...defaultProps}
          innerRef={innerRef}
          outerRef={outerRef}
        />,
        document.createElement('div')
      );
      expect(innerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(outerRef.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('custom tag names', () => {
    it('should use a custom innerTagName if specified', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} innerTagName="section" />
      );
      expect(rendered.root.findByType('section')).toBeDefined();
    });

    it('should use a custom outerTagName if specified', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} outerTagName="section" />
      );
      expect(rendered.root.findByType('section')).toBeDefined();
    });
  });

  describe('itemData', () => {
    it('should pass itemData to item renderers as a "data" prop', () => {
      const itemData = {};
      ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} itemData={itemData} />
      );
      expect(itemRenderer).toHaveBeenCalled();
      expect(
        itemRenderer.mock.calls.filter(([params]) => params.data === itemData)
      ).toHaveLength(itemRenderer.mock.calls.length);
    });

    it('should re-render items if itemData changes', () => {
      const itemData = {};
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} itemData={itemData} />
      );
      expect(itemRenderer).toHaveBeenCalled();
      itemRenderer.mockClear();

      // Re-rendering should not affect pure sCU children:
      rendered.update(<FixedSizeList {...defaultProps} itemData={itemData} />);
      expect(itemRenderer).not.toHaveBeenCalled();

      // Re-rendering with new itemData should re-render children:
      const newItemData = {};
      rendered.update(
        <FixedSizeList {...defaultProps} itemData={newItemData} />
      );
      expect(itemRenderer).toHaveBeenCalled();
      expect(
        itemRenderer.mock.calls.filter(
          ([params]) => params.data === newItemData
        )
      ).toHaveLength(itemRenderer.mock.calls.length);
    });
  });

  describe('props validation', () => {
    beforeEach(() => spyOn(console, 'error'));

    it('should fail if non-numeric itemSize is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList {...defaultProps} itemSize="abc" />
        )
      ).toThrow(
        'An invalid "itemSize" prop has been specified. ' +
          'Value should be a number. ' +
          '"string" was specified.'
      );
    });

    it('should fail if no children value is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList {...defaultProps} children={undefined} />
        )
      ).toThrow(
        'An invalid "children" prop has been specified. ' +
          'Value should be a React component. ' +
          '"undefined" was specified.'
      );
    });

    it('should fail if an invalid direction is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList {...defaultProps} direction={null} />
        )
      ).toThrow(
        'An invalid "direction" prop has been specified. ' +
          'Value should be either "horizontal" or "vertical". ' +
          '"null" was specified.'
      );
    });

    it('should fail if a string height is provided for a vertical list', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList {...defaultProps} direction="vertical" height="100%" />
        )
      ).toThrow(
        'An invalid "height" prop has been specified. ' +
          'Vertical lists must specify a number for height. ' +
          '"string" was specified.'
      );
    });

    it('should fail if a string width is provided for a horizontal list', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList
            {...defaultProps}
            direction="horizontal"
            width="100%"
          />
        )
      ).toThrow(
        'An invalid "width" prop has been specified. ' +
          'Horizontal lists must specify a number for width. ' +
          '"string" was specified.'
      );
    });
  });
});
