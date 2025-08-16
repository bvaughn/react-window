import { List, type RowComponentProps } from "react-window";

type RowProps = {
  names: string[];
};

function Example({ names }: { names: string[] }) {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names } satisfies RowProps}
    />
  );
}

function RowComponent({ index, names, style }: RowComponentProps<RowProps>) {
  return <div style={style}>{names[index]}</div>;
}

// <end>

export { Example, RowComponent };
