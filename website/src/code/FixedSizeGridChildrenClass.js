// Declare your item renderer outside of the render method:
class ItemRenderer extends PureComponent {
  render() {
    return (
      <div style={this.props.style}>
        row {this.props.rowIndex}, column {this.props.columnIndex}
      </div>
    );
  }
}

// Reference it inside of the render method:
<FixedSizeGrid {...props}>
  {ItemRenderer}
</FixedSizeGrid>