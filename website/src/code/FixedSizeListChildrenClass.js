// Declare your item renderer outside of the render method:
class ItemRenderer extends PureComponent {
  render() {
    return (
      <div style={this.props.style}>
        Item {this.props.index}
      </div>
    );
  }
}

// Reference it inside of the render method:
<FixedSizeList {...props}>
  {ItemRenderer}
</FixedSizeList>