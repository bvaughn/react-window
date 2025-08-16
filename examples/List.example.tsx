import { List, type RowComponentProps } from "react-window";

function Example() {
  return (
    <div style={{ height: "150px" }}>
      <List rowComponent={RowComponent} rowCount={100} rowHeight={25} />
    </div>
  );
}

function RowComponent({ index, style }: RowComponentProps<object>) {
  return <div style={style}>Row {index}</div>;
}
