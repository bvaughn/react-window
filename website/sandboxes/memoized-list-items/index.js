import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import memoize from 'memoize-one';
import { FixedSizeList as List } from 'react-window';

const generateItems = numItems =>
  Array(numItems)
    .fill(true)
    .map(_ => ({
      isActive: false,
      label: Math.random()
        .toString(36)
        .substr(2),
    }));

// If list items are expensive to render,
// Consider using PureComponent to avoid unnecessary re-renders.
// https://reactjs.org/docs/react-api.html#reactpurecomponent
class ListItem extends PureComponent {
  render() {
    const { data, index, style } = this.props;

    // Data passed to List as "itemData" is available as props.data
    const { items, toggleItemActive } = data;
    const item = items[index];

    return (
      <div onClick={() => toggleItemActive(index)} style={style}>
        {item.label} is {item.isActive ? 'active' : 'inactive'}
      </div>
    );
  }
}

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure ListItem components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const getItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive,
}));

class App extends PureComponent {
  state = {
    items: generateItems(1000),
  };

  toggleItemActive = index =>
    this.setState(prevState => {
      const item = prevState.items[index];
      const items = prevState.items.concat();
      items[index] = {
        ...item,
        isActive: !item.isActive,
      };
      return { items };
    });

  render() {
    const { items } = this.state;

    // Bundle additional data to list items using the "itemData" prop.
    // It will be accessible to item renderers as props.data.
    // Memoize this data to avoid bypassing shouldComponentUpdate().
    const itemData = getItemData(items, this.toggleItemActive);

    return (
      <List
        height={150}
        itemCount={items.length}
        itemData={itemData}
        itemSize={35}
        width={300}
      >
        {ListItem}
      </List>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
