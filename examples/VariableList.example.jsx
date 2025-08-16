import { VariableList } from "react-window";

function Example({ items }) {
  return (
    <VariableList
      rowComponent={RowComponent}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowProps={{ items }}
    />
  );
}

function rowHeight(index, { items }) {
  return items[index].type === "header" ? 35 : 25;
}

function RowComponent({ index, items, style }) {
  return <div style={style}>{items[index].value}</div>;
}
