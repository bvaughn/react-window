import React, { createRef, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import { FixedSizeGrid } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

const simulateScroll = (instance, { scrollLeft, scrollTop }) => {
  instance._outerRef.scrollLeft = scrollLeft;
  instance._outerRef.scrollTop = scrollTop;
  ReactTestUtils.Simulate.scroll(instance._outerRef);
};

describe('FixedSizeGrid', () => {
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
      columnCount: 100,
      columnWidth: 100,
      height: 100,
      onItemsRendered,
      rowCount: 100,
      rowHeight: 25,
      width: 200,
    };
  });

  it('should render an empty grid', () => {
    ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} columnCount={0} rowCount={0} />
    );
    ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} columnCount={0} />
    );
    ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} rowCount={0} />);
    expect(itemRenderer).not.toHaveBeenCalled();
    expect(onItemsRendered).not.toHaveBeenCalled();
  });

  it('should render a grid of items', () => {
    ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
    expect(itemRenderer).toHaveBeenCalledTimes(24);
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  describe('style caching', () => {
    it('should cache styles while scrolling to avoid breaking pure sCU for items', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll a few times.
      // Each time, make sure to render row 3, column 1.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'start' });
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 2, align: 'start' });
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 3, align: 'start' });
      // Find all of the times row 3, column 1 was rendered.
      // If we are caching props correctly, it should only be once.
      expect(
        itemRenderer.mock.calls.filter(
          ([params]) => params.rowIndex === 3 && params.columnIndex === 1
        )
      ).toHaveLength(1);
    });

    it('should reset cached styles when scrolling stops', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      // Scroll, then capture the rendered style for item 1,
      // Then let the debounce timer clear the cached styles.
      simulateScroll(instance, { scrollLeft: 100, scrollTop: 25 });
      const itemOneArgsA = itemRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      jest.runAllTimers();
      itemRenderer.mockClear();
      // Scroll again, then capture the rendered style for item 1,
      // And confirm that the style was recreated.
      simulateScroll(instance, { scrollLeft: 0, scrollTop: 0 });
      const itemOneArgsB = itemRenderer.mock.calls.find(
        ([params]) => params.columnIndex === 1 && params.rowIndex === 1
      );
      expect(itemOneArgsA[0].style).not.toBe(itemOneArgsB[0].style);
    });
  });

  it('changing item size updates the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    rendered.update(<FixedSizeGrid {...defaultProps} columnWidth={150} />);
    rendered.update(
      <FixedSizeGrid {...defaultProps} columnWidth={150} rowHeight={50} />
    );
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('changing itemSize updates the rendered items and busts the style cache', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    const styleOne = itemRenderer.mock.calls[0][0].style;
    itemRenderer.mockClear();
    rendered.update(<FixedSizeGrid {...defaultProps} columnWidth={150} />);
    expect(itemRenderer).toHaveBeenCalled();
    const styleTwo = itemRenderer.mock.calls[0][0].style;
    expect(styleOne).not.toBe(styleTwo);
    itemRenderer.mockClear();
    rendered.update(
      <FixedSizeGrid {...defaultProps} columnWidth={150} rowHeight={50} />
    );
    const styleThree = itemRenderer.mock.calls[0][0].style;
    expect(styleTwo).not.toBe(styleThree);
  });

  it('should support momentum scrolling on iOS devices', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    expect(rendered.toJSON().props.style.WebkitOverflowScrolling).toBe('touch');
  });

  it('should disable pointer events while scrolling', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeGrid {...defaultProps} />
    );
    const scrollContainer = findScrollContainer(rendered);
    expect(scrollContainer.props.style.pointerEvents).toBe('');
    rendered.getInstance().setState({ isScrolling: true });
    expect(scrollContainer.props.style.pointerEvents).toBe('none');
  });

  describe('style overrides', () => {
    it('should support className prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} className="custom" />
      );
      expect(rendered.toJSON().props.className).toBe('custom');
    });

    it('should support style prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} style={{ backgroundColor: 'red' }} />
      );
      expect(rendered.toJSON().props.style.backgroundColor).toBe('red');
    });
  });

  describe('overscanCount', () => {
    it('should require a minimum of 1 overscan to support tabbing', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          initialScrollLeft={250}
          initialScrollTop={250}
          overscanCount={0}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should accommodate a custom overscan', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          initialScrollLeft={250}
          initialScrollTop={250}
          overscanCount={2}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should overscan in the direction being scrolled', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          initialScrollLeft={250}
          initialScrollTop={250}
          overscanCount={2}
        />
      );
      rendered.getInstance().scrollTo({ scrollLeft: 1000, scrollTop: 1000 });
      rendered.getInstance().scrollTo({ scrollLeft: 500, scrollTop: 500 });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the beginning of the grid', () => {
      ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not scan past the end of the grid', () => {
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          columnCount={10}
          initialScrollLeft={900}
          initialScrollTop={150}
          rowCount={10}
        />
      );
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('useIsScrolling', () => {
    it('should not pass an isScrolling param to children unless requested', () => {
      ReactTestRenderer.create(<FixedSizeGrid {...defaultProps} />);
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(undefined);
    });

    it('should pass an isScrolling param to children if requested', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
      itemRenderer.mockClear();
      simulateScroll(instance, { scrollLeft: 300, scrollTop: 400 });
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(true);
      itemRenderer.mockClear();
      jest.runAllTimers();
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });

    it('should not re-render children unnecessarily if isScrolling param is not used', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} />,
        document.createElement('div')
      );
      simulateScroll(instance, { scrollLeft: 300, scrollTop: 400 });
      itemRenderer.mockClear();
      jest.runAllTimers();
      expect(itemRenderer).not.toHaveBeenCalled();
    });
  });

  describe('scrollTo method', () => {
    it('should not report isScrolling', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      itemRenderer.mockClear();
      instance.scrollTo({ scrollLeft: 100, scrollTop: 100 });
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });

    it('should allow only scrollLeft or scrollTop values to be specified', () => {
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );

      instance.scrollTo({ scrollLeft: 100, scrollTop: 100 });
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleColumnStartIndex: 1,
          visibleColumnStopIndex: 3,
          visibleRowStartIndex: 4,
          visibleRowStopIndex: 8,
        })
      );

      itemRenderer.mockClear();
      instance.scrollTo({ scrollTop: 200 });
      expect(onItemsRendered).toHaveBeenCalled();
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleColumnStartIndex: 1,
          visibleColumnStopIndex: 3,
        })
      );

      itemRenderer.mockClear();
      instance.scrollTo({ scrollLeft: 150 });
      expect(onItemsRendered).toHaveBeenCalled();
      expect(onItemsRendered).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visibleRowStartIndex: 8,
          visibleRowStopIndex: 12,
        })
      );
    });
  });

  describe('scrollToItem method', () => {
    it('should not set invalid offsets when the list contains few items', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          columnCount={1}
          rowCount={2}
          onScroll={onScroll}
        />
      );
      onScroll.mockClear();
      // Offset should not be negative.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 0, rowIndex: 0, align: 'auto' });
      expect(onScroll).toHaveBeenCalledWith({
        horizontalScrollDirection: 'backward',
        scrollLeft: 0,
        scrollTop: 0,
        scrollUpdateWasRequested: true,
        verticalScrollDirection: 'backward',
      });
    });

    it('should scroll to the correct item for align = "auto"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'auto' });
      // No need to scroll again; item 9 is already visible.
      // Overscan indices will change though, since direction changes.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'auto' });
      // Scroll up enough to show item 2 at the top.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 2, rowIndex: 2, align: 'auto' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "start"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the top.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'start' });
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'start' });
      // Item 99 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'start' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 at the bottom.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'end' });
      // Scroll back up so that item 9 is at the bottom.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'end' });
      // Item 1 can't align at the bottom because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'end' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "center"', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} />
      );
      // Scroll down enough to show item 10 in the middle.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 10, rowIndex: 10, align: 'center' });
      // Scroll back up so that item 9 is in the middle.
      // Overscroll direction wil change too.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 9, rowIndex: 9, align: 'center' });
      // Item 1 can't align in the middle because it's too close to the beginning.
      // Scroll up as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 1, rowIndex: 1, align: 'center' });
      // Item 99 can't align in the middle because it's too close to the end.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered
        .getInstance()
        .scrollToItem({ columnIndex: 99, rowIndex: 99, align: 'center' });
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should not report isScrolling', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      itemRenderer.mockClear();
      instance.scrollToItem({ columnIndex: 15, rowIndex: 20 });
      expect(itemRenderer.mock.calls[0][0].isScrolling).toBe(false);
    });
  });

  // onItemsRendered is pretty well covered by other snapshot tests
  describe('onScroll', () => {
    it('should call onScroll after mount', () => {
      const onScroll = jest.fn();
      ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} onScroll={onScroll} />
      );
      expect(onScroll.mock.calls).toMatchSnapshot();
    });

    it('should call onScroll when scroll position changes', () => {
      const onScroll = jest.fn();
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} onScroll={onScroll} />
      );
      rendered.getInstance().scrollTo({
        scrollLeft: 100,
        scrollTop: 50,
      });
      rendered.getInstance().scrollTo({
        scrollLeft: 0,
        scrollTop: 150,
      });
      rendered.getInstance().scrollTo({
        scrollLeft: 150,
        scrollTop: 0,
      });
      expect(onScroll.mock.calls).toMatchSnapshot();
    });

    it('should distinguish between "onScroll" events and scrollTo() calls', () => {
      const onScroll = jest.fn();
      // Use ReactDOM renderer so the container ref and "onScroll" event work correctly.
      const instance = ReactDOM.render(
        <FixedSizeGrid {...defaultProps} onScroll={onScroll} />,
        document.createElement('div')
      );

      onScroll.mockClear();
      instance.scrollTo({ scrollLeft: 100, scrollTop: 100 });
      expect(onScroll.mock.calls[0][0].scrollUpdateWasRequested).toBe(true);

      onScroll.mockClear();
      simulateScroll(instance, { scrollLeft: 200, scrollTop: 200 });
      expect(onScroll.mock.calls[0][0].scrollUpdateWasRequested).toBe(false);
    });
  });

  describe('itemKey', () => {
    it('should be used', () => {
      const itemKey = jest.fn(
        ({ columnIndex, rowIndex }) => `${rowIndex}:${columnIndex}`
      );
      ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          columnCount={3}
          rowCount={2}
          itemKey={itemKey}
        />
      );
      expect(itemKey).toHaveBeenCalledTimes(6);
      expect(itemKey.mock.calls[0][0]).toEqual({ columnIndex: 0, rowIndex: 0 });
      expect(itemKey.mock.calls[1][0]).toEqual({ columnIndex: 1, rowIndex: 0 });
      expect(itemKey.mock.calls[2][0]).toEqual({ columnIndex: 2, rowIndex: 0 });
      expect(itemKey.mock.calls[3][0]).toEqual({ columnIndex: 0, rowIndex: 1 });
      expect(itemKey.mock.calls[4][0]).toEqual({ columnIndex: 1, rowIndex: 1 });
      expect(itemKey.mock.calls[5][0]).toEqual({ columnIndex: 2, rowIndex: 1 });
    });

    it('should allow items to be moved within the collection without causing caching problems', () => {
      const keyMap = [['0:0', '0:1:', '0:2'], ['1:0', '1:1:', '1:2']];
      const keyMapItemRenderer = jest.fn(({ index, style }) => (
        <div style={style}>{keyMap[index]}</div>
      ));
      class ItemRenderer extends PureComponent {
        render() {
          return keyMapItemRenderer(this.props);
        }
      }
      const itemKey = jest.fn(
        ({ columnIndex, rowIndex }) => keyMap[rowIndex][columnIndex]
      );
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid
          {...defaultProps}
          columnCount={3}
          rowCount={2}
          itemKey={itemKey}
        >
          {ItemRenderer}
        </FixedSizeGrid>
      );
      expect(itemKey).toHaveBeenCalledTimes(6);
      itemKey.mockClear();

      expect(keyMapItemRenderer).toHaveBeenCalledTimes(6);
      keyMapItemRenderer.mockClear();

      // Simulate swapping the first and last items.
      keyMap[0][0] = '1:2';
      keyMap[1][2] = '0:0';

      rendered.getInstance().forceUpdate();

      // Our key getter should be called again for each key.
      // Since we've modified the map, the first and last key will swap.
      expect(itemKey).toHaveBeenCalledTimes(6);

      // The first and third item have swapped place,
      // So they should have been re-rendered,
      // But the second item should not.
      expect(keyMapItemRenderer).toHaveBeenCalledTimes(2);
      expect(keyMapItemRenderer.mock.calls[0][0].columnIndex).toBe(0);
      expect(keyMapItemRenderer.mock.calls[0][0].rowIndex).toBe(0);
      expect(keyMapItemRenderer.mock.calls[1][0].columnIndex).toBe(2);
      expect(keyMapItemRenderer.mock.calls[1][0].rowIndex).toBe(1);
    });
  });

  describe('refs', () => {
    it('should pass through innerRef and outerRef ref functions', () => {
      const innerRef = jest.fn();
      const outerRef = jest.fn();
      ReactDOM.render(
        <FixedSizeGrid
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
        <FixedSizeGrid
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
        <FixedSizeGrid {...defaultProps} innerTagName="section" />
      );
      expect(rendered.root.findByType('section')).toBeDefined();
    });

    it('should use a custom outerTagName if specified', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} outerTagName="section" />
      );
      expect(rendered.root.findByType('section')).toBeDefined();
    });
  });

  describe('itemData', () => {
    it('should pass itemData to item renderers as a "data" prop', () => {
      const itemData = {};
      ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} itemData={itemData} />
      );
      expect(itemRenderer).toHaveBeenCalled();
      expect(
        itemRenderer.mock.calls.filter(([params]) => params.data === itemData)
      ).toHaveLength(itemRenderer.mock.calls.length);
    });

    it('should re-render items if itemData changes', () => {
      const itemData = {};
      const rendered = ReactTestRenderer.create(
        <FixedSizeGrid {...defaultProps} itemData={itemData} />
      );
      expect(itemRenderer).toHaveBeenCalled();
      itemRenderer.mockClear();

      // Re-rendering should not affect pure sCU children:
      rendered.update(<FixedSizeGrid {...defaultProps} itemData={itemData} />);
      expect(itemRenderer).not.toHaveBeenCalled();

      // Re-rendering with new itemData should re-render children:
      const newItemData = {};
      rendered.update(
        <FixedSizeGrid {...defaultProps} itemData={newItemData} />
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

    it('should fail if non-numeric columnWidth is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} columnWidth="abc" />
        )
      ).toThrow(
        'An invalid "columnWidth" prop has been specified. ' +
          'Value should be a number. ' +
          '"string" was specified.'
      );
    });

    it('should fail if non-numeric rowHeight is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} rowHeight="abc" />
        )
      ).toThrow(
        'An invalid "rowHeight" prop has been specified. ' +
          'Value should be a number. ' +
          '"string" was specified.'
      );
    });

    it('should fail if no children value is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} children={undefined} />
        )
      ).toThrow(
        'An invalid "children" prop has been specified. ' +
          'Value should be a React component. ' +
          '"undefined" was specified.'
      );
    });

    it('should fail if a string height is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid {...defaultProps} direction="vertical" height="100%" />
        )
      ).toThrow(
        'An invalid "height" prop has been specified. ' +
          'Grids must specify a number for height. ' +
          '"string" was specified.'
      );
    });

    it('should fail if a string width is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeGrid
            {...defaultProps}
            direction="horizontal"
            width="100%"
          />
        )
      ).toThrow(
        'An invalid "width" prop has been specified. ' +
          'Grids must specify a number for width. ' +
          '"string" was specified.'
      );
    });
  });
});
