import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import { FixedSizeList as List } from 'react-window';

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
      <div
        onClick={() => toggleItemActive(index)}
        style={style}
      >
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

class Example extends PureComponent {
  state = {
    items: [
      // Initialize/load items...
    ],
  };

  toggleItemActive = index =>
    this.setState(prevState => {
      const item = prevState.items[index];
      return {
        items: {
          ...prevState.items,
          [index]: {
            ...item,
            isActive: !item.isActive,
          },
        },
      };
    });

  render() {
    // Bundle additional data to list items using the "itemData" prop.
    // It will be accessible to item renderers as props.data.
    // Memoize this data to avoid bypassing shouldComponentUpdate().
    const itemData = getItemData(this.state.items, this.toggleItemActive);

    return (
      <List
        height={height}
        itemCount={listData.length}
        itemData={itemData}
        itemSize={35}
        width={width}
      >
        {ListItem}
      </List>
    );
  }
}
