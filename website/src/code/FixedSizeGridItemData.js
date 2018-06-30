class ComponentThatRendersAGridOfItems extends PureComponent {
  render() {
    // Pass the data source to the item renderer component as itemData:
    return (
      <FixedSizeGrid
        itemData={this.props.itemsArray}
        {...otherGridProps}
      >
        {ItemRenderer}
      </FixedSizeGrid>
    );
  }
}

// The item renderer is declared outside of the list-rendering component.
// So it has no way to directly access the data source.
class ItemRenderer extends PureComponent {
  render() {
    const { columnIndex, data, rowIndex, style } = this.props;

    // Access the data source using the "data" prop:
    const item = data[rowIndex][columnIndex];

    return (
      <div style={style}>
        {item}
      </div>
    );
  }
}