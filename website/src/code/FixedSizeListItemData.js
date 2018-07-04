class ComponentThatRendersAListOfItems extends PureComponent {
  render() {
    // Pass items array to the item renderer component as itemData:
    return (
      <FixedSizeList
        itemData={this.props.itemsArray}
        {...otherListProps}
      >
        {ItemRenderer}
      </FixedSizeList>
    );
  }
}

// The item renderer is declared outside of the list-rendering component.
// So it has no way to directly access the items array.
class ItemRenderer extends PureComponent {
  render() {
    // Access the items array using the "data" prop:
    const item = this.props.data[this.props.index];

    return (
      <div style={this.props.style}>
        {item.name}
      </div>
    );
  }
}