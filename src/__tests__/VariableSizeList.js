import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { VariableSizeList } from '..';

const findScrollContainer = rendered => rendered.root.children[0].children[0];

describe('VariableSizeList', () => {
  let itemRenderer, defaultProps, onItemsRendered;

  beforeEach(() => {
    jest.useFakeTimers();

    itemRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));
    onItemsRendered = jest.fn();
    defaultProps = {
      children: itemRenderer,
      estimatedItemSize: 25,
      height: 100,
      itemCount: 20,
      itemSize: index => 25 + index,
      onItemsRendered,
      width: 50,
    };
  });

  // Much of the shared List functionality is already tested by FixedSizeList tests.
  // This test covers functionality that is unique to VariableSizeList.

  it('changing itemSize does not impact the rendered items', () => {
    const rendered = ReactTestRenderer.create(
      <VariableSizeList {...defaultProps} />
    );
    itemRenderer.mockClear();
    rendered.update(
      <VariableSizeList
        {...defaultProps}
        itemSize={index => 50}
        onItemsRendered={onItemsRendered}
      />
    );
    expect(itemRenderer).not.toHaveBeenCalled();
  });

  describe('estimatedItemSize', () => {
    it('should estimate an initial scrollable size based on this value', () => {
      const itemSize = jest.fn(() => 25);
      const rendered = ReactTestRenderer.create(
        <VariableSizeList
          {...defaultProps}
          estimatedItemSize={50}
          height={100}
          itemCount={100}
          itemSize={itemSize}
          overscanCount={0}
        />
      );
      // We'll render 5 rows initially, each at 25px tall (125px total).
      // The remaining 95 rows will be estimated at 50px tall (4,750px total).
      // This means an initial height estimate of 4,875px.
      expect(itemSize).toHaveBeenCalledTimes(5);
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style.height).toEqual(4875);
    });

    it('should udpate the scrollable size as more items are measured', () => {
      const itemSize = jest.fn(() => 25);
      const rendered = ReactTestRenderer.create(
        <VariableSizeList
          {...defaultProps}
          estimatedItemSize={50}
          itemCount={100}
          itemSize={itemSize}
          overscanCount={0}
        />
      );
      rendered.getInstance().scrollToItem(18);
      // Including the additional 1 (minimum) overscan row,
      // We've now measured 20 rows, each at 25px tall (500px total).
      // The remaining 80 rows will be estimated at 50px tall (4,500px total).
      // This means an updated height estimate of 4,500px.
      expect(itemSize).toHaveBeenCalledTimes(20);
      const scrollContainer = findScrollContainer(rendered);
      expect(scrollContainer.props.style.height).toEqual(4500);
    });
  });

  describe('scrollToItem method', () => {
    it('should scroll to the correct item for align = "auto"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
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
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
      );
      // Scroll down enough to show item 10 at the top.
      rendered.getInstance().scrollToItem(10, 'start');
      // Scroll back up so that item 9 is at the top.
      // Overscroll direction wil change too.
      rendered.getInstance().scrollToItem(9, 'start');
      // Item 19 can't align at the top because there aren't enough items.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(19, 'start');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });

    it('should scroll to the correct item for align = "end"', () => {
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
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
      const onItemsRendered = jest.fn();
      const rendered = ReactTestRenderer.create(
        <VariableSizeList {...defaultProps} onItemsRendered={onItemsRendered} />
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
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
      // Item 19 can't align in the middle because it's too close to the end.
      // Scroll down as far as possible though.
      // Overscroll direction wil change again.
      rendered.getInstance().scrollToItem(19, 'center');
      expect(onItemsRendered.mock.calls).toMatchSnapshot();
    });
  });

  describe('resetAfterIndex method', () => {
    it('should recalculate the estimated total size', () => {
      // TODO Verify total size estimate is updated.
    });

    it('should re-render items after the specified index with updated styles', () => {
      // TODO Verify rendered item sizes are updated,
      // And that our sCU caching strategy doesn't block the update,
      // If it does we may have to revert to on-fiber style cache,
      // Or somehow use an incremented key value to reset all items in the current window.
    });
  });

  describe('props validation', () => {
    beforeEach(() => spyOn(console, 'error'));

    it('should fail if non-function itemSize is provided', () => {
      expect(() =>
        ReactTestRenderer.create(
          <VariableSizeList {...defaultProps} itemSize={123} />
        )
      ).toThrow(
        'An invalid "itemSize" prop has been specified. ' +
          'Value should be a function. "number" was specified.'
      );
    });
  });
});
