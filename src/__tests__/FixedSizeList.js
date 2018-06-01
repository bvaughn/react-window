import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import { FixedSizeList } from '..';

const simulateScroll = (instance, scrollOffset, direction = 'vertical') => {
  if (direction === 'horizontal') {
    instance._scrollingContainer.scrollLeft = scrollOffset;
  } else {
    instance._scrollingContainer.scrollTop = scrollOffset;
  }
  ReactTestUtils.Simulate.scroll(instance._scrollingContainer);
};

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('FixedSizeList', () => {
  let cellRenderer, defaultProps, onItemsRendered;

  beforeEach(() => {
    jest.useFakeTimers();

    onItemsRendered = jest.fn();

    cellRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    defaultProps = {
      children: cellRenderer,
      height: 100,
      itemCount: 100,
      itemSize: 25,
      onItemsRendered,
      width: 50,
    };
  });

  it('should render an empty list', () => {
    ReactTestRenderer.create(<FixedSizeList {...defaultProps} itemCount={0} />);
    expect(cellRenderer.mock.calls.length).toMatchSnapshot();
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should render a list of rows', () => {
    ReactTestRenderer.create(<FixedSizeList {...defaultProps} />);
    expect(cellRenderer.mock.calls.length).toMatchSnapshot();
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should render a list of columns', () => {
    ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} direction="horizontal" />
    );
    expect(cellRenderer.mock.calls.length).toMatchSnapshot();
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
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
      // Find all of the times cell 3 was rendered.
      // If we are caching props correctly, it should only be once.
      expect(
        cellRenderer.mock.calls.find(([params]) => params.index === 3)
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
      const cellOneA = cellRenderer.mock.calls.find(
        ([params]) => params.index === 1
      );
      jest.runAllTimers();
      cellRenderer.mockClear();
      // Scroll again, then capture the rendered style for item 1,
      // And confirm that the style was recreated.
      simulateScroll(instance, 0);
      const cellOneB = cellRenderer.mock.calls.find(
        ([params]) => params.index === 1
      );
      expect(cellOneA[0].style).not.toBe(cellOneB[0].style);
    });
  });

  it('changing itemSize updates the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    rendered.update(<FixedSizeList {...defaultProps} itemSize={50} />);
    expect(onItemsRendered.mock.calls).toMatchSnapshot();
  });

  it('should support momentum scrolling on iOS devices', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    expect(
      rendered.toJSON().props.style.WebkitOverflowScrolling
    ).toMatchSnapshot();
  });

  it('should disable pointer events while scrolling', () => {
    const rendered = ReactTestRenderer.create(
      <FixedSizeList {...defaultProps} />
    );
    const scrollContainer = findScrollContainer(rendered);
    expect(scrollContainer.props.style).toMatchSnapshot();
    rendered.getInstance().setState({ isScrolling: true });
    expect(scrollContainer.props.style).toMatchSnapshot();
  });

  describe('style overrides', () => {
    it('should support className prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} className="custom" />
      );
      expect(rendered.toJSON().props.className).toMatchSnapshot();
    });

    it('should support style prop', () => {
      const rendered = ReactTestRenderer.create(
        <FixedSizeList {...defaultProps} style={{ backgroundColor: 'red' }} />
      );
      expect(rendered.toJSON().props.style.backgroundColor).toMatchSnapshot();
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
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
    });

    it('should pass an isScrolling param to children if requested', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
      cellRenderer.mockClear();
      simulateScroll(instance, 100);
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
      cellRenderer.mockClear();
      jest.runAllTimers();
      expect(cellRenderer.mock.calls[0]).toMatchSnapshot();
    });

    it('should not re-render children unnecessarily if isScrolling param is not used', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} />,
        document.createElement('div')
      );
      simulateScroll(instance, 100);
      cellRenderer.mockClear();
      jest.runAllTimers();
      expect(cellRenderer).not.toHaveBeenCalled();
    });
  });

  describe('scrollTo method', () => {
    it('should not report isScrolling', () => {
      // Use ReactDOM renderer so the container ref and "onScroll" work correctly.
      const instance = ReactDOM.render(
        <FixedSizeList {...defaultProps} useIsScrolling />,
        document.createElement('div')
      );
      cellRenderer.mockClear();
      instance.scrollTo(100);
      expect(cellRenderer.mock.calls[0][0].isScrolling).toMatchSnapshot();
    });
  });

  describe('scrollToItem method', () => {
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
      cellRenderer.mockClear();
      instance.scrollToItem(15);
      expect(cellRenderer.mock.calls[0][0].isScrolling).toMatchSnapshot();
    });
  });

  // onItemsRendered is pretty well covered by other snapshot tests
  describe('onScroll', () => {
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
      expect(
        onScroll.mock.calls[0][0].scrollUpdateWasRequested
      ).toMatchSnapshot();

      onScroll.mockClear();
      simulateScroll(instance, 200);
      expect(
        onScroll.mock.calls[0][0].scrollUpdateWasRequested
      ).toMatchSnapshot();
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

    it('should fail if no children function is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <FixedSizeList {...defaultProps} children={undefined} />
        )
      ).toThrow(
        'An invalid "children" prop has been specified. ' +
          'Value should be a function that creates a React element. ' +
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
