import React, { createRef } from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { _setScrollType } from 'normalize-scroll-left';
import { FixedSizeGrid, FixedSizeList } from '..';

describe('RTL', () => {
  let rendering;
  let container;
  let itemRenderer;
  let defaultProps;
  let outerRef;
  let onScroll;

  beforeEach(() => {
    onScroll = jest.fn();
    container = document.createElement('div');
    itemRenderer = jest.fn(({ style, ...rest }) => (
      <div style={style}>{JSON.stringify(rest, null, 2)}</div>
    ));

    outerRef = createRef();
  });

  afterEach(() => {
    _setScrollType(undefined);
  });

  function simulateScroll(scrollLeft) {
    outerRef.current.scrollLeft = scrollLeft;
    Simulate.scroll(outerRef.current);
  }

  describe('FixedSizedGrid', () => {
    function createGridAndSetWidths() {
      rendering = render(<FixedSizeGrid {...defaultProps} />, container);
      Object.defineProperties(outerRef.current, {
        clientWidth: { writable: true },
        scrollWidth: { writable: true },
      });
      outerRef.current.clientWidth = 200;
      outerRef.current.scrollWidth = 1000;

      itemRenderer.mockClear();
      onScroll.mockClear();
    }

    function expectColumnRendered(column) {
      expect(
        itemRenderer.mock.calls.find(
          ([params]) => params.columnIndex === column
        )
      ).toBeTruthy();
    }

    function expectColumnNotRendered(column) {
      expect(
        itemRenderer.mock.calls.find(
          ([params]) => params.columnIndex === column
        )
      ).toBeFalsy();
    }

    function testUserScrollingHorizontally(scrollLeft) {
      describe(`when the user scrolls horizontally to ${scrollLeft}`, () => {
        beforeEach(() => {
          simulateScroll(scrollLeft);
        });

        it('renders columns 2 to 6', () => {
          expectColumnNotRendered(0);
          expectColumnNotRendered(1);
          expectColumnRendered(2);
          expectColumnRendered(3);
          expectColumnRendered(4);
          expectColumnRendered(5);
          expectColumnRendered(6);
          expectColumnNotRendered(7);
          expectColumnNotRendered(8);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollLeft,
            scrollTop: 0,
            horizontalScrollDirection: 'forward',
            verticalScrollDirection: 'backward',
            scrollUpdateWasRequested: false,
          });
        });
      });
    }

    function testScrollToCall(scrollLeft) {
      describe(`when scrollTo is called with ${scrollLeft}`, () => {
        beforeEach(() => {
          rendering.scrollTo({ scrollLeft });
        });

        it('renders correctly when the user scrolls', () => {
          expectColumnNotRendered(0);
          expectColumnNotRendered(1);
          expectColumnNotRendered(2);
          expectColumnNotRendered(3);
          expectColumnRendered(4);
          expectColumnRendered(5);
          expectColumnRendered(6);
          expectColumnRendered(7);
          expectColumnRendered(8);
          expectColumnNotRendered(9);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollLeft,
            scrollTop: 0,
            horizontalScrollDirection: 'forward',
            verticalScrollDirection: 'backward',
            scrollUpdateWasRequested: true,
          });
        });
      });
    }

    function testWhenScrollToItemCalledWith7(scrollLeft) {
      describe('when scrolled to column 7', () => {
        beforeEach(() => {
          rendering.scrollToItem({ columnIndex: 7 });
        });

        it(`sets scrollLeft to ${scrollLeft}`, () => {
          expect(outerRef.current.scrollLeft).toEqual(scrollLeft);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollLeft,
            scrollTop: 0,
            horizontalScrollDirection: 'forward',
            verticalScrollDirection: 'backward',
            scrollUpdateWasRequested: true,
          });
        });
      });
    }

    beforeEach(() => {
      defaultProps = {
        children: itemRenderer,
        columnCount: 10,
        columnWidth: 100,
        height: 100,
        rowCount: 20,
        rowHeight: 100,
        width: 200,
        direction: 'rtl',
        outerRef,
        onScroll,
      };
    });

    describe('default scrollType', () => {
      beforeEach(() => {
        _setScrollType('default');
        createGridAndSetWidths();
      });

      testUserScrollingHorizontally(500);

      testScrollToCall(300);

      testWhenScrollToItemCalledWith7(200);
    });

    describe('reverse scrollType', () => {
      beforeEach(() => {
        _setScrollType('reverse');
        createGridAndSetWidths();
      });

      testUserScrollingHorizontally(300);

      testScrollToCall(500);

      testWhenScrollToItemCalledWith7(600);
    });

    describe('negative scrollType', () => {
      beforeEach(() => {
        _setScrollType('negative');
        createGridAndSetWidths();
      });

      testUserScrollingHorizontally(-300);

      testScrollToCall(-500);

      testWhenScrollToItemCalledWith7(-600);
    });
  });

  describe('FixedSizedList', () => {
    function createListAndSetWidths() {
      rendering = render(<FixedSizeList {...defaultProps} />, container);
      Object.defineProperties(outerRef.current, {
        clientWidth: { writable: true },
        scrollWidth: { writable: true },
      });
      outerRef.current.clientWidth = 200;
      outerRef.current.scrollWidth = 1000;

      itemRenderer.mockClear();
      onScroll.mockClear();
    }

    function expectItemRendered(column) {
      expect(
        itemRenderer.mock.calls.find(([params]) => params.index === column)
      ).toBeTruthy();
    }

    function expectItemNotRendered(column) {
      expect(
        itemRenderer.mock.calls.find(([params]) => params.index === column)
      ).toBeFalsy();
    }

    function testUserScrollingHorizontally(scrollLeft) {
      describe(`when the user scrolls horizontally to ${scrollLeft}`, () => {
        beforeEach(() => {
          simulateScroll(scrollLeft);
        });

        it('renders columns 2 to 6', () => {
          expectItemNotRendered(0);
          expectItemNotRendered(1);
          expectItemRendered(2);
          expectItemRendered(3);
          expectItemRendered(4);
          expectItemRendered(5);
          expectItemRendered(6);
          expectItemNotRendered(7);
          expectItemNotRendered(8);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollOffset: scrollLeft,
            scrollDirection: 'forward',
            scrollUpdateWasRequested: false,
          });
        });
      });
    }

    function testScrollToCall(scrollLeft) {
      describe(`when scrollTo is called with ${scrollLeft}`, () => {
        beforeEach(() => {
          rendering.scrollTo(scrollLeft);
        });

        it('renders correctly when the user scrolls', () => {
          expectItemNotRendered(0);
          expectItemNotRendered(1);
          expectItemNotRendered(2);
          expectItemNotRendered(3);
          expectItemRendered(4);
          expectItemRendered(5);
          expectItemRendered(6);
          expectItemRendered(7);
          expectItemRendered(8);
          expectItemNotRendered(9);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollOffset: scrollLeft,
            scrollDirection: 'forward',
            scrollUpdateWasRequested: true,
          });
        });
      });
    }

    function testWhenScrollToItemCalledWith7(scrollLeft) {
      describe('when scrolled to column 7', () => {
        beforeEach(() => {
          rendering.scrollToItem(7);
        });

        it(`sets scrollLeft to ${scrollLeft}`, () => {
          expect(outerRef.current.scrollLeft).toEqual(scrollLeft);
        });

        it('reports onScroll as the browser sees it', () => {
          expect(onScroll).toHaveBeenCalledWith({
            scrollOffset: scrollLeft,
            scrollDirection: 'forward',
            scrollUpdateWasRequested: true,
          });
        });
      });
    }

    beforeEach(() => {
      defaultProps = {
        children: itemRenderer,
        itemCount: 10,
        itemSize: 100,
        height: 100,
        width: 200,
        layout: 'horizontal',
        direction: 'rtl',
        overscanCount: 1,
        outerRef,
        onScroll,
      };
    });

    describe('default scrollType', () => {
      beforeEach(() => {
        _setScrollType('default');
        createListAndSetWidths();
      });

      testUserScrollingHorizontally(500);

      testScrollToCall(300);

      testWhenScrollToItemCalledWith7(200);
    });

    describe('reverse scrollType', () => {
      beforeEach(() => {
        _setScrollType('reverse');
        createListAndSetWidths();
      });

      testUserScrollingHorizontally(300);

      testScrollToCall(500);

      testWhenScrollToItemCalledWith7(600);
    });

    describe('negative scrollType', () => {
      beforeEach(() => {
        _setScrollType('negative');
        createListAndSetWidths();
      });

      testUserScrollingHorizontally(-300);

      testScrollToCall(-500);

      testWhenScrollToItemCalledWith7(-600);
    });
  });

  describe('When there is enough space to render all items', () => {
    describe('List', () => {
      beforeEach(() => {
        defaultProps = {
          children: itemRenderer,
          itemCount: 4,
          itemSize: 100,
          height: 100,
          width: 800,
          layout: 'horizontal',
          direction: 'rtl',
          overscanCount: 1,
          outerRef,
          onScroll,
        };
      });

      function createListAndSetWidths() {
        rendering = render(<FixedSizeList {...defaultProps} />, container);
        Object.defineProperties(outerRef.current, {
          clientWidth: { writable: true },
          scrollWidth: { writable: true },
        });
        outerRef.current.clientWidth = 800;
        outerRef.current.scrollWidth = 800;

        itemRenderer.mockClear();
        onScroll.mockClear();
      }

      function testWhenScrollToItemCalledWith2() {
        describe('when scrolled to column 2', () => {
          beforeEach(() => {
            rendering.scrollToItem(2);
          });

          it('does not report onScroll', () => {
            expect(onScroll).not.toHaveBeenCalled();
          });
        });
      }

      describe('default scrollType', () => {
        beforeEach(() => {
          _setScrollType('default');
          createListAndSetWidths();
        });

        testWhenScrollToItemCalledWith2();
      });

      describe('reverse scrollType', () => {
        beforeEach(() => {
          _setScrollType('reverse');
          createListAndSetWidths();
        });

        testWhenScrollToItemCalledWith2();
      });

      describe('negative scrollType', () => {
        beforeEach(() => {
          _setScrollType('negative');
          createListAndSetWidths();
        });

        testWhenScrollToItemCalledWith2();
      });
    });

    describe('Grid', () => {
      beforeEach(() => {
        defaultProps = {
          children: itemRenderer,
          columnCount: 4,
          columnWidth: 100,
          height: 800,
          rowCount: 4,
          rowHeight: 100,
          width: 800,
          direction: 'rtl',
          outerRef,
          onScroll,
        };
      });

      function createGridAndSetWidths() {
        rendering = render(<FixedSizeGrid {...defaultProps} />, container);
        Object.defineProperties(outerRef.current, {
          clientWidth: { writable: true },
          scrollWidth: { writable: true },
        });
        outerRef.current.clientWidth = 800;
        outerRef.current.scrollWidth = 800;

        itemRenderer.mockClear();
        onScroll.mockClear();
      }

      function testWhenScrollToItemCalledWithCol2() {
        describe('when scrolled to column 2', () => {
          beforeEach(() => {
            rendering.scrollToItem({ columnIndex: 2 });
          });

          it('does not report onScroll', () => {
            expect(onScroll).not.toHaveBeenCalled();
          });
        });
      }

      describe('default scrollType', () => {
        beforeEach(() => {
          _setScrollType('default');
          createGridAndSetWidths();
        });

        testWhenScrollToItemCalledWithCol2();
      });

      describe('reverse scrollType', () => {
        beforeEach(() => {
          _setScrollType('reverse');
          createGridAndSetWidths();
        });

        testWhenScrollToItemCalledWithCol2();
      });

      describe('negative scrollType', () => {
        beforeEach(() => {
          _setScrollType('negative');
          createGridAndSetWidths();
        });

        testWhenScrollToItemCalledWithCol2();
      });
    });
  });
});
