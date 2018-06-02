import { FixedSizeList as List } from 'react-window';

const listRef = React.createRef();

// You can programatically scroll to a item within a List.
// First, attach a ref to the List:
<List ref={listRef} {...props} />

// Then call the scrollToItem() API method with an item index:
listRef.current.scrollToItem(200);

// The List will scroll as little as possible to ensure the item is visible.
// You can also specify a custom alignment: center, start, or end.
// For example:
listRef.current.scrollToItem(300, "center");