import { FixedSizeGrid as Grid } from 'react-window';

const gridRef = React.createRef();

// You can programatically scroll to a item within a Grid.
// First, attach a ref to the Grid:
<Grid ref={gridRef} {...props} />

// Then call the scrollToItem() API method with the item indices:
gridRef.current.scrollToItem({
  columnIndex: 50,
  rowIndex: 100
});

// The Grid will scroll as little as possible to ensure the item is visible.
// You can also specify a custom alignment: center, start, or end.
// For example:
gridRef.current.scrollToItem({
  align: "start",
  columnIndex: 150,
  rowIndex: 300
});

// You can specify only columnIndex or rowIndex if you just want to scroll one axis.
// For example:
gridRef.current.scrollToItem({
  columnIndex: 100,
});