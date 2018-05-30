<FixedSizeGrid {...props}>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style}>
      row {rowIndex}, column {columnIndex}
    </div>
  )}
</FixedSizeGrid>