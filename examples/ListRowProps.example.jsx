import { List } from "react-window";

function Example({ names }) {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names }}
    />
  );
}

function RowComponent({ index, names, style }) {
  return <div style={style}>{names[index]}</div>;
}
