# Changelog

## 2.5.0

### Features

- Add `scrollElement` prop to `List` and `Grid` for lists and grids that scroll along with other content. Pass `"window"` to scroll with the page, or an ancestor element that scrolls. The list or grid renders at its full height and only renders the rows visible within the scroll element's viewport; its position within the scroll element is measured whenever it renders, scrolls, or resizes, and whenever content before it is resized, inserted, or removed (e.g. an image loading above it). Imperative scroll methods scroll the scroll element. Grid columns scroll with the scroll element too if the grid is as wide as its content (e.g. `style={{ width: "max-content" }}`); otherwise they scroll within the grid. Add a [scrolling with the page](https://react-window.vercel.app/list/scroll-element) page to the docs site.
- Add `useVirtualizer` hook for rendering custom (headless) virtualized content, e.g. a semantic `<table>`. It returns the items to render (with their offsets and sizes), the total size, the visible range, and a `scrollToIndex` method; options mirror the props of `List` (including `scrollElement` and dynamic sizes from `useDynamicRowHeight`). Add a [useVirtualizer](https://react-window.vercel.app/hooks/use-virtualizer) page to the docs site.
- Add `useIsScrolling` hook for tracking whether a list, grid, or scroll element is scrolling (e.g. to render simplified rows while scrolling). It uses the "scrollend" event where supported. Add a [useIsScrolling](https://react-window.vercel.app/hooks/use-is-scrolling) page to the docs site (replacing the common question about scrolling indicators).
- Scrolling to a row, column, or cell (`scrollToRow`, `scrollToColumn`, `scrollToCell`, and `useVirtualizer`'s `scrollToIndex`) respects the CSS `scroll-padding` of the element being scrolled, like the browser's `scrollIntoView`. For example, `scroll-padding-top` can keep rows from being aligned underneath a sticky header.
- Add an [infinite loading](https://react-window.vercel.app/infinite-loading) page to the docs site.

## 2.4.1

- Fix performance issues for fixed-size rows or columns with a size of 0 (e.g. a percentage size before the container has been measured). Rendering no longer computes and caches bounds for every item, and only the first item is rendered (previously the last items were rendered, or every item if the scroll offset was negative). Invalid sizes (e.g. `"abc%"` or negative values) are treated as 0. - [#923](https://github.com/bvaughn/react-window/pull/923)

## 2.4.0

Server rendering improvements:

### Features

- Add `defaultScrollOffset` prop to `List` and `defaultScrollLeft`/`defaultScrollTop` props to `Grid` for setting the initial scroll position. Server-rendered HTML can't be pre-scrolled, so server rendering starts at the first row and the default scroll offset is applied when the component hydrates (unless the browser has already restored a scroll position). For lists and grids that are initially empty (e.g. while data is loading), the offset is applied once they have rows.
- Add `initialRowHeights` option to `useDynamicRowHeight` for providing row heights that are known or can be estimated ahead of time (e.g. during server rendering).
- Add a [server rendering](https://react-window.vercel.app/server-rendering) page to the docs site.

### Bug fixes

- Server-rendered rows with dynamic heights are now displayed in normal document flow until they have been measured, rather than being positioned using estimated heights (which caused rows to overlap or leave gaps until after hydration).
- Fix `List` and `Grid` logging `useLayoutEffect` warnings when server rendered with React 18.
- Fix `getScrollbarSize` throwing when called during server rendering; it now returns 0.

## 2.3.4

- Fix `useDynamicRowHeight` not measuring rows that set an `aria-hidden` attribute. - [#917](https://github.com/bvaughn/react-window/pull/917)
- Support rendering into a different window (e.g. an iframe or a pop-up window opened with a portal). `List`, `Grid`, and `useDynamicRowHeight` now use the `ResizeObserver`, `requestAnimationFrame`, and `document` that belong to the window containing the list, rather than the globals of the window that loaded the library. - [#918](https://github.com/bvaughn/react-window/pull/918)
  - `getScrollbarSize` accepts an optional `ownerDocument` parameter and caches the measured size separately for each document.

## 2.3.3

- Fix a small performance regression in 2.3.2 that caused unnecessary size calculations when scrolling beyond the cached bounds of dynamically sized rows or columns. - [#916](https://github.com/bvaughn/react-window/pull/916)

## 2.3.2

- Improve `scrollToRow` accuracy for rows with dynamic heights. - [#914](https://github.com/bvaughn/react-window/pull/914)
- Bug fixes: - [#915](https://github.com/bvaughn/react-window/pull/915)
  - Fix RTL scrolling and alignment.
  - Fix stale row measurements after rows are reordered with `rowKey`.
  - Fix updates to `rowProps`/`cellProps` being dropped when props are added or removed.
  - Support fractional percentage sizes (e.g. `"33.3%"`) for row heights and column widths.
  - Fix `"center"` alignment for items near the start or end of a list.
- Performance improvements: - [#915](https://github.com/bvaughn/react-window/pull/915)
  - Calculate the visible range directly for fixed-size items, and search cached bounds for variable-size items, instead of scanning from the first item.
  - Avoid allocating bounds for preceding items when jumping to a fixed-size item.

## 2.3.1

- Fix `Grid` not updating its layout direction when the `dir` prop changes after mount. - [#913](https://github.com/bvaughn/react-window/pull/913)

## 2.3.0

- Add optional `rowKey` prop to `List` and optional `rowKey`/`columnKey` props to `Grid`. - [#911](https://github.com/bvaughn/react-window/pull/911)

## 2.2.7

- Fix the project logo not displaying in the README in Firefox.

## 2.2.6

- Fix `useDynamicRowHeight` creating a `ResizeObserver` during server rendering. - [#902](https://github.com/bvaughn/react-window/pull/902)

## 2.2.5

- Use the `defaultHeight`/`defaultWidth` props to server-render an initial set of rows/cells. - [#896](https://github.com/bvaughn/react-window/pull/896)
- Adjust the TypeScript return type of `rowComponent`/`cellComponent` to work around the `ReactNode` vs `ReactElement` mismatch introduced in 2.2.2. - [#875](https://github.com/bvaughn/react-window/issues/875)

## 2.2.4

- Update README docs.

## 2.2.3

- Update TSDoc comments for the `List` and `Grid` imperative methods to specify when each method throws. - [#880](https://github.com/bvaughn/react-window/pull/880)
- Throw a `RangeError` (instead of a generic `Error`) when an invalid index is passed to one of the imperative scroll-to methods. - [#880](https://github.com/bvaughn/react-window/pull/880)

## 2.2.2

- Explicitly annotate the return type of `List` and `Grid` as `ReactElement`, and change the return type of `rowComponent`/`cellComponent` from `ReactNode` to `ReactElement`. This fixes TypeScript warnings for React versions 18.0 through 18.2. - [#875](https://github.com/bvaughn/react-window/issues/875), [#876](https://github.com/bvaughn/react-window/pull/876)

## 2.2.1

- Fix a possible scroll jump when using `useDynamicRowHeight`. - [#868](https://github.com/bvaughn/react-window/pull/868)

## 2.2.0

- Support dynamic row heights via the new `useDynamicRowHeight` hook. - [#857](https://github.com/bvaughn/react-window/pull/857)

```tsx
const rowHeight = useDynamicRowHeight({
  defaultRowHeight: 50
});

return <List rowHeight={rowHeight} {...rest} />;
```

- Reduce the NPM package size by no longer including the docs. - [#858](https://github.com/bvaughn/react-window/pull/858)

## 2.1.2

- Don't use the `ResizeObserver` API when an explicit `List` height (or `Grid` width and height) is provided. - [#855](https://github.com/bvaughn/react-window/pull/855)

## 2.1.1

- Fix `Grid` incorrectly setting cell height to 100% when there is only one row.

## 2.1.0

- Improve ARIA support:
  - Add better default ARIA attributes to the outer `HTMLDivElement`.
  - Add an `ariaAttributes` prop to row and cell components, to make it easier to apply the right ARIA attributes to user-rendered rows and cells (see example below).
- Remove the intermediate `HTMLDivElement` from `List` and `Grid`, which allows more flexible CSS styling.
- Add optional `tagName` prop; defaults to `"div"` but can be changed to e.g. `"ul"`.
- Add optional `children` prop to `List` and `Grid` for content such as overlays, tooltips, or sticky rows.
- Pass a second parameter to the `onRowsRendered` and `onCellsRendered` callbacks, to make it easier to tell _visible_ items apart from items rendered because of overscan. The first parameter describes the _visible_ items and the second describes _all_ rendered items (including overscan; see example below).

```tsx
// Example of how to use the new `ariaAttributes` prop
function RowComponent({
  ariaAttributes,
  index,
  style,
  ...rest
}: RowComponentProps<object>) {
  return (
    <div style={style} {...ariaAttributes}>
      ...
    </div>
  );
}
```

```ts
function onRowsRendered(
  visibleRows: {
    startIndex: number;
    stopIndex: number;
  },
  allRows: {
    startIndex: number;
    stopIndex: number;
  }
): void {
  // ...
}

function onCellsRendered(
  visibleCells: {
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
  },
  allCells: {
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
  }
): void {
  // ...
}
```

## 2.0.2

- Fix an edge case bug in the `Grid` imperative `scrollToCell` method when using `"smooth"` scrolling.

## 2.0.1

- Remove the default ARIA `role` attribute from `List` and `Grid`. It could produce invalid configurations (e.g. an ARIA _list_ should contain at least one _listitem_, but this library did not enforce that). Specify the `role` that makes the most sense for your content, [based on MDN guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/list_role#best_practices). For example:

```tsx
<List
  role="list"
  rowComponent={RowComponent}
  rowCount={names.length}
  rowHeight={25}
  rowProps={{ names }}
/>;

function RowComponent({ index, style, ...rest }: RowComponentProps<object>) {
  return (
    <div role="listitem" style={style}>
      ...
    </div>
  );
}
```

# 2.0.0

Version 2 is a major rewrite that offers the following benefits:

- More ergonomic props API
- Automatic memoization of row/cell renderers and props/context
- Automatic sizing for `List` and `Grid` (no more need for `AutoSizer`)
- Native TypeScript support (no more need for `@types/react-window`)
- Smaller bundle size

## Upgrade path

This section contains a couple of examples for common upgrade paths. Please refer to the [documentation](https://react-window.vercel.app/) for more information.

### Migrating `FixedSizeList`

#### Before

```tsx
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, type ListChildComponentProps } from "react-window";

function Example({ names }: { names: string[] }) {
  const itemData = useMemo<ItemData>(() => ({ names }), [names]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          children={Row}
          height={height}
          itemCount={names.length}
          itemData={itemData}
          itemSize={25}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

function Row({
  data,
  index,
  style
}: ListChildComponentProps<{
  names: string[];
}>) {
  const { names } = data;
  const name = names[index];
  return <div style={style}>{name}</div>;
}
```

#### After

```tsx
import { List, type RowComponentProps } from "react-window";

function Example({ names }: { names: string[] }) {
  // You don't need to useMemo for rowProps;
  // List will automatically memoize them
  return (
    <List
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names }}
    />
  );
}

function RowComponent({
  index,
  names,
  style
}: RowComponentProps<{
  names: string[];
}>) {
  const name = names[index];
  return <div style={style}>{name}</div>;
}
```

### Migrating `VariableSizeList`

#### Before

```tsx
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList, type ListChildComponentProps } from "react-window";

function Example({ items }: { items: Item[] }) {
  const itemData = useMemo<ItemData>(() => ({ items }), [items]);
  const itemSize = useCallback(
    (index: number) => {
      const item = itemData.items[index];
      return item.type === "header" ? 40 : 20;
    },
    [itemData]
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeList
          children={Row}
          height={height}
          itemCount={items.length}
          itemData={itemData}
          itemSize={itemSize}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

function Row({
  data,
  index,
  style
}: ListChildComponentProps<{
  items: Item[];
}>) {
  const { items } = data;
  const item = items[index];
  return <div style={style}>{item.label}</div>;
}
```

#### After

```tsx
import { List, type RowComponentProps } from "react-window";

type RowProps = {
  items: Item[];
};

function Example({ items }: { items: Item[] }) {
  // You don't need to useMemo for rowProps;
  // List will automatically memoize them
  return (
    <List
      rowComponent={RowComponent}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowProps={{ items }}
    />
  );
}

// The rowHeight method also receives the extra props,
// so it can be defined at the module level
function rowHeight(index: number, { items }: RowProps) {
  return items[index].type === "header" ? 40 : 20;
}

function RowComponent({ index, items, style }: RowComponentProps<RowProps>) {
  const item = items[index];
  return <div style={style}>{item.label}</div>;
}
```

### Migrating `FixedSizeGrid`

#### Before

```tsx
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, type GridChildComponentProps } from "react-window";

function Example({ data }: { data: Data[] }) {
  const itemData = useMemo<ItemData>(() => ({ data }), [data]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeGrid
          children={Cell}
          columnCount={data[0]?.length ?? 0}
          columnWidth={100}
          height={height}
          itemData={itemData}
          rowCount={data.length}
          rowHeight={35}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

function Cell({
  columnIndex,
  data,
  rowIndex,
  style
}: GridChildComponentProps<{
  data: Data[];
}>) {
  const datum = data.data[rowIndex][columnIndex];
  return <div style={style}>...</div>;
}
```

#### After

```tsx
import { Grid, type CellComponentProps } from "react-window";

function Example({ data }: { data: Data[] }) {
  // You don't need to useMemo for cellProps;
  // Grid will automatically memoize them
  return (
    <Grid
      cellComponent={Cell}
      cellProps={{ data }}
      columnCount={data[0]?.length ?? 0}
      columnWidth={75}
      rowCount={data.length}
      rowHeight={25}
    />
  );
}

function Cell({
  columnIndex,
  data,
  rowIndex,
  style
}: CellComponentProps<{
  data: Data[];
}>) {
  const datum = data[rowIndex][columnIndex];
  return <div style={style}>...</div>;
}
```

### Migrating `VariableSizeGrid`

#### Before

```tsx
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeGrid, type GridChildComponentProps } from "react-window";

function Example({ data }: { data: Data[] }) {
  const itemData = useMemo<ItemData>(() => ({ data }), [data]);

  const columnWidth = useCallback(
    (columnIndex: number) => {
      // ...
    },
    [itemData]
  );

  const rowHeight = useCallback(
    (rowIndex: number) => {
      // ...
    },
    [itemData]
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeGrid
          children={Cell}
          columnCount={data[0]?.length ?? 0}
          columnWidth={columnWidth}
          height={height}
          itemData={itemData}
          rowCount={data.length}
          rowHeight={rowHeight}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

function Cell({
  columnIndex,
  data,
  rowIndex,
  style
}: GridChildComponentProps<{
  data: Data[];
}>) {
  const datum = data.data[rowIndex][columnIndex];
  return <div style={style}>...</div>;
}
```

#### After

```tsx
import { Grid, type CellComponentProps } from "react-window";

type CellProps = {
  data: Data[];
};

function Example({ data }: { data: Data[] }) {
  // You don't need to useMemo for cellProps;
  // Grid will automatically memoize them
  return (
    <Grid
      cellComponent={Cell}
      cellProps={{ data }}
      columnCount={data[0]?.length ?? 0}
      columnWidth={columnWidth}
      rowCount={data.length}
      rowHeight={rowHeight}
    />
  );
}

// The columnWidth method also receives the extra props,
// so it can be defined at the module level
function columnWidth(columnIndex: number, { data }: CellProps) {
  // ...
}

// The rowHeight method also receives the extra props,
// so it can be defined at the module level
function rowHeight(rowIndex: number, { data }: CellProps) {
  // ...
}

function Cell({
  columnIndex,
  data,
  rowIndex,
  style
}: CellComponentProps<CellProps>) {
  const datum = data[rowIndex][columnIndex];
  return <div style={style}>...</div>;
}
```

### ⚠️ Version 2 requirements

The following requirements are new in version 2 and may be reasons to consider _not_ upgrading:

- Peer dependencies now require React version 18 or newer.
- `ResizeObserver` primitive (or a polyfill) is required _unless_ explicit pixel dimensions are provided via the `style` prop (see documentation for more).

## 1.8.11

- ✨ Updated peer dependencies to include React v19.

## 1.8.10

- 🐛 Fixed `scrollDirection` when direction is RTL. - [#690](https://github.com/bvaughn/react-window/pull/690)

## 1.8.9

- README changes.

## 1.8.8

- 🐛 `scrollToItem` accounts for scrollbar size in the uncommon case where a List component has scrolling in the non-dominant direction (e.g. a "vertical" layout list also scrolls horizontally).

## 1.8.7

- ✨ Updated peer dependencies to include React v18.

## 1.8.6

- ✨ Updated peer dependencies to include React v17.

## 1.8.5

- ✨ Added UMD (dev and prod) build - ([emmanueltouzery](https://github.com/emmanueltouzery) - [#281](https://github.com/bvaughn/react-window/pull/281))

## 1.8.4

- 🐛 Fixed size list and grid components now accurately report `visibleStopIndex` in `onItemsRendered`. (Previously this value was incorrectly reported as one index higher.) - ([justingrant](https://github.com/justingrant) - [#274](https://github.com/bvaughn/react-window/pull/274))
- 🐛 Fixed size list and grid components `scrollToItem` "center" mode when the item being scrolled to is near the viewport edge. - ([justingrant](https://github.com/justingrant) - [#274](https://github.com/bvaughn/react-window/pull/274))

## 1.8.3

- 🐛 Edge case bug-fix for `scrollToItem` when scrollbars are present ([MarkFalconbridge](https://github.com/MarkFalconbridge) - [#267](https://github.com/bvaughn/react-window/pull/267))
- 🐛 Fixed RTL scroll offsets for non-Chromium Edge ([MarkFalconbridge](https://github.com/MarkFalconbridge) - [#268](https://github.com/bvaughn/react-window/pull/268))
- 🐛 Flow types improved ([TrySound](https://github.com/TrySound) - [#260](https://github.com/bvaughn/react-window/pull/260))

## 1.8.2

- ✨ Deprecated grid props `overscanColumnsCount` and `overscanRowsCount` props in favor of more consistently named `overscanColumnCount` and `overscanRowCount`. ([nihgwu](https://github.com/nihgwu) - [#229](https://github.com/bvaughn/react-window/pull/229))
- 🐛 Fixed shaky elastic scroll problems present in iOS Safari. [#244](https://github.com/bvaughn/react-window/issues/244)
- 🐛 Fixed RTL edge case bugs and broken scroll-to-item behavior. [#159](https://github.com/bvaughn/react-window/issues/159)
- 🐛 Fixed broken synchronized scrolling for RTL lists/grids. [#198](https://github.com/bvaughn/react-window/issues/198)

## 1.8.1

- 🐛 Replaced an incorrect empty-string value for `pointer-events` with `undefined` ([oliviertassinari](https://github.com/oliviertassinari) - [#210](https://github.com/bvaughn/react-window/pull/210))

## 1.8.0

- 🎉 Added new "smart" align option for grid and list scroll-to-item methods ([gaearon](https://github.com/gaearon) - [#209](https://github.com/bvaughn/react-window/pull/209))

## 1.7.2

- 🐛 Add guards to avoid invalid scroll offsets when `scrollTo()` is called with a negative offset or when `scrollToItem` is called with invalid indices (negative or too large).

## 1.7.1

- 🐛 Fix SSR regression introduced in 1.7.0 - ([Betree](https://github.com/Betree) - [#185](https://github.com/bvaughn/react-window/pull/185))

## 1.7.0

- 🎉 Grid `scrollToItem` supports optional `rowIndex` and `columnIndex` params ([jgoz](https://github.com/jgoz) - [#174](https://github.com/bvaughn/react-window/pull/174))
- DEV mode checks for `WeakSet` support before using it to avoid requiring a polyfill for IE11 - ([jgoz](https://github.com/jgoz) - [#167](https://github.com/bvaughn/react-window/pull/167))

## 1.6.2

- 🐛 Bugfix for RTL when scrolling back towards the beginning (right) of the list.

## 1.6.1

- 🐛 Bugfix to account for differences between Chrome and non-Chrome browsers with regard to RTL and "scroll" events.

## 1.6.0

- 🎉 RTL support added for lists and grids. Special thanks to [davidgarsan](https://github.com/davidgarsan) for their support. - [#156](https://github.com/bvaughn/react-window/pull/156)
- 🐛 Grid `scrollToItem` methods take scrollbar size into account when aligning items - [#153](https://github.com/bvaughn/react-window/issues/153)

## 1.5.2

- 🐛 Edge case bug fix for `VariableSizeList` and `VariableSizeGrid` when the number of items decreases while a scroll is in progress. - ([iamsolankiamit](https://github.com/iamsolankiamit) - [#138](https://github.com/bvaughn/react-window/pull/138))

## 1.5.1

- 🐛 Updated `getDerivedState` Flow annotations to address a warning in a newer version of Flow.

## 1.5.0

- 🎉 Added advanced memoization helper methods `areEqual` and `shouldComponentUpdate` for item renderers. - [#114](https://github.com/bvaughn/react-window/issues/114)

## 1.4.0

- 🎉 List and Grid components now "overscan" (pre-render) in both directions when scrolling is not active. When scrolling is in progress, cells are only pre-rendered in the direction being scrolled. This change has been made in an effort to reduce visible flicker when scrolling starts without adding additional overhead during scroll (which is the most performance sensitive time).
- 🎉 Grid components now support separate `overscanColumnsCount` and `overscanRowsCount` props. Legacy `overscanCount` prop will continue to work, but with a deprecation warning in DEV mode.
- 🐛 Replaced `setTimeout` with `requestAnimationFrame` based timer, to avoid starvation issue for `isScrolling` reset. - [#106](https://github.com/bvaughn/react-window/issues/106)
- 🎉 Renamed List and Grid `innerTagName` and `outerTagName` props to `innerElementType` and `outerElementType` to formalize support for attaching arbitrary props (e.g. test ids) to List and Grid inner and outer DOM elements. Legacy `innerTagName` and `outerTagName` props will continue to work, but with a deprecation warning in DEV mode.
- 🐛 List re-renders items if `direction` prop changes. - [#104](https://github.com/bvaughn/react-window/issues/104)

## 1.3.1

- 🎉 Pass `itemData` value to custom `itemKey` callbacks when present - [#90](https://github.com/bvaughn/react-window/issues/90)

## 1.3.0

- (Skipped)

## 1.2.4

- 🐛 Added Flow annotations to memoized methods to avoid a Flow warning for newer versions of Flow

## 1.2.3

- 🐛 Relaxed `children` validation checks. They were too strict and didn't support new React APIs like `memo`.

## 1.2.2

- 🐛 Improved Flow types for class component item renderers - ([nicholas-l](https://github.com/nicholas-l) - [#77](https://github.com/bvaughn/react-window/pull/77))

## 1.2.1

- 🎉 Improved Flow types to include optional `itemData` parameter. ([TrySound](https://github.com/TrySound) - [#66](https://github.com/bvaughn/react-window/pull/66))
- 🐛 `VariableSizeList` and `VariableSizeGrid` no longer call size getter functions with invalid index when item count is zero.

## 1.2.0

- 🎉 Flow types added to NPM package. ([TrySound](https://github.com/TrySound) - [#40](https://github.com/bvaughn/react-window/pull/40))
- 🎉 Relaxed grid `scrollTo` method to make `scrollLeft` and `scrollTop` params _optional_ (so you can only update one axis if desired). - [#63](https://github.com/bvaughn/react-window/pull/63)
- 🐛 Fixed invalid `this` pointer in `VariableSizeGrid` that broke the `resetAfter*` methods - [#58](https://github.com/bvaughn/react-window/pull/58)
- Upgraded to babel 7 and used shared runtime helpers to reduce package size slightly. ([TrySound](https://github.com/TrySound) - [#48](https://github.com/bvaughn/react-window/pull/48))
- Remove `overflow:hidden` from inner container ([souporserious](https://github.com/souporserious) - [#56](https://github.com/bvaughn/react-window/pull/56))

## 1.1.2

- 🐛 Fixed edge case `scrollToItem` bug that caused lists/grids with very few items to have negative scroll offsets.

## 1.1.1

- 🐛 `FixedSizeGrid` and `FixedSizeList` automatically clear style cache when item size props change.

## 1.1.0

- 🎉 Use explicit `constructor` and `super` to generate cleaner component code. ([Andarist](https://github.com/Andarist) - [#26](https://github.com/bvaughn/react-window/pull/26))
- 🎉 Add optional `shouldForceUpdate` param to reset-index methods to specify `forceUpdate` behavior. ([nihgwu](https://github.com/nihgwu) - [#32](https://github.com/bvaughn/react-window/pull/32))

## 1.0.3

- 🐛 Avoid unnecessary scrollbars for lists (e.g. no horizontal scrollbar for a vertical list) unless content requires them.

## 1.0.2

- 🎉 Enable Babel `annotate-pure-calls` option so that classes compiled by "transform-es2015-classes" are annotated with `#__PURE__`. This enables [UglifyJS to remove them if they are not referenced](https://github.com/mishoo/UglifyJS2/pull/1448), improving dead code elimination in application code. ([Andarist](https://github.com/Andarist) - [#20](https://github.com/bvaughn/react-window/pull/20))
- 🎉 Update "rollup-plugin-peer-deps-external" and use new `includeDependencies` flag so that the "memoize-one" dependency does not get inlined into the Rollup bundle. ([Andarist](https://github.com/Andarist) - [#19](https://github.com/bvaughn/react-window/pull/19))
- 🎉 Enable [Babel "loose" mode](https://babeljs.io/docs/en/babel-preset-env#loose) to reduce package size (-8%). ([Andarist](https://github.com/Andarist) - [#18](https://github.com/bvaughn/react-window/pull/18))

## 1.0.1

- Updated `README.md` file to remove `@alpha` tag from NPM installation instructions.

# 1.0.0

Initial release of library. Includes the following components:

- `FixedSizeGrid`
- `FixedSizeList`
- `VariableSizeGrid`
- `VariableSizeList`
