import { List, type RowProps } from "react-window";
import { Box } from "../../components/Box";
import Code from "../../components/code/Code";
import { names } from "../../data";
import { Block } from "../../components/Block";

export function ListFixedRowHeightRoute() {
  return (
    <Box direction="column" gap={4}>
      <div>
        The simplest type of list to render is one with fixed row heights:
      </div>
      <Block className="h-50" data-focus-within="bold">
        <List
          length={names.length}
          rowComponent={Row}
          rowHeight={25}
          rowProps={{ names }}
        />
      </Block>
      <div>
        Row height is controlled by the <code>rowHeight</code> prop.
      </div>
      <Code code={CODE_LIST} transparent={false} />
      <div>
        Individual rows are rendered by the function component passed to the{" "}
        <code>RowComponent</code> prop.
      </div>
      <Code code={CODE_ROW} transparent={false} />
      <div>This component receives two special props:</div>
      <dl className="pl-4">
        <dt className="font-bold">index</dt>
        <dl className="pl-4">specifies which row (data) to render</dl>
        <dt className="font-bold">style</dt>
        <dl className="pl-4">positions the row within the larger list</dl>
      </dl>
      <div>
        The component also receives additional values passed to{" "}
        <code>rowProps</code>. (In the example above, the parent list uses this
        prop to share the <code>names</code> array with the row component.)
      </div>
    </Box>
  );
}

function Row({
  index,
  names,
  style,
}: RowProps<{
  names: string[];
}>) {
  return (
    <div className="flex items-center" style={style}>
      {names[index]}
    </div>
  );
}

const CODE_LIST = `
import { List } from 'react-window';

function ListOfNames({ names }) {
  return (
    <List
      length={names.length}
      rowComponent={Row}
      rowHeight={25}
      rowProps={{ names }}
      style={{ height: 150 }}
    />
  );
}
`;

const CODE_ROW = `
function Row({ index, names, style }) {
  return (
    <div style={style}>
      {names[index]}
    </div>
  )
}
`;
