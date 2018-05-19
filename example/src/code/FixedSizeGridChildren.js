<FixedSizeGrid {...props}>
  {({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
      row {rowIndex}, column {columnIndex}
    </div>
  )}
</FixedSizeGrid>