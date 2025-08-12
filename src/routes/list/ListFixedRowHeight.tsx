import { List, type RowProps } from "react-window";
import { Box } from "../../components/Box";
import Code from "../../components/code/Code";
import { names } from "../../data";
import { Block } from "../../components/Block";
import { Callout } from "../../components/Callout";
import { ExternalLink } from "../../components/ExternalLink";
import { Link } from "react-router-dom";

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
      <div>This type of list requires the following props:</div>
      <ul className="pl-6">
        <li className="list-disc">
          Number of rows to render (<code>length</code>)
        </li>
        <li className="list-disc">
          Row height in pixels (<code>rowHeight</code>)
        </li>
        <li className="list-disc">
          Row component (<code>rowComponent</code>)
        </li>
      </ul>
      <Code code={CODE} transparent={false} />
      <Callout intent="primary">
        Lists will automatically render enough rows to fill their height
        (calculated using a{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          <code>ResizeObserver</code>
        </ExternalLink>
        ). The example above uses an inline style to set height, but it could
        also be set by <code>className</code> or as determined by the parent
        component's layout.
      </Callout>
      <div>
        For lists of rows with different sizes,{" "}
        <Link to="/list/variable-row-heights">keep reading</Link>...
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

// This component accepts a "names" prop
// because it was passed to the List "rowProps" object
function Row({ index, names, style }) {
  return (
    <div style={style}>
      {names[index]}
    </div>
  )
}
`;
