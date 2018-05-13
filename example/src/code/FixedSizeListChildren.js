<FixedSizeList {...props}>
  {({ key, index, style }) => (
    <div key={key} style={style}>
      Item {index}
    </div>
  )}
</FixedSizeList>