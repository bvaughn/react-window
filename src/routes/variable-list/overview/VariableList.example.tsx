import { VariableList, type RowComponentProps } from "react-window";

type Item = { type: "header"; value: string } | { type: "item"; value: string };

type RowProps = {
  items: Item[];
};

function Example({ items }: { items: Item[] }) {
  return (
    <VariableList
      rowComponent={RowComponent}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowProps={{ items } satisfies RowProps}
    />
  );
}

function rowHeight(index: number, { items }: RowProps) {
  return items[index].type === "header" ? 35 : 25;
}

function RowComponent({ index, items, style }: RowComponentProps<RowProps>) {
  return <div style={style}>{items[index].value}</div>;
}

// <end>

export { Example, RowComponent };
