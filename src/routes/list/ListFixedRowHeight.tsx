import { List, type RowProps } from "react-window";
import { Box } from "../../components/Box";
import Code from "../../components/code/Code";
import { names } from "../../data";
import { Block } from "../../components/Block";

export function ListFixedRowHeightRoute() {
  return (
    <Box direction="column" gap={4}>
      <div>
        The simplest type of list to render is one with fixed row heights.
      </div>
      <Code code={CODE} transparent={false} />
      <Block className="h-50" data-focus-within>
        <List
          length={names.length}
          rowComponent={Row}
          rowHeight={30}
          rowProps={{ names }}
        />
      </Block>
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

const CODE = `
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

function Row({ index, names, style }) {
  return (
    <div style={style}>{names[index]}</div>
  )
}
`;
