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
          rowComponent={Row}
          rowCount={names.length}
          rowHeight={25}
          rowProps={{ names }}
        />
      </Block>
      <div>This type of list requires the following props:</div>
      <ul className="pl-6">
        <li className="list-disc">
          Number of rows to render (<code>rowCount</code>)
        </li>
        <li className="list-disc">
          A component that renders individual rows (<code>rowComponent</code>)
        </li>
        <li className="list-disc">
          The height of a row, in pixels (<code>rowHeight</code>)
        </li>
      </ul>
      <Code code={CODE_BASE} transparent={false} />
      <Callout intent="primary">
        Lists will automatically render enough rows to fill their height
        (calculated using a{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          <code>ResizeObserver</code>
        </ExternalLink>
        ). Height can be controlled using <code>style</code> or{" "}
        <code>className</code> props, or it can be determined by the parent
        component's layout.
      </Callout>
      <div>
        Rows often require more data to render. You can use{" "}
        <ExternalLink href="https://react.dev/learn/passing-data-deeply-with-context">
          React Context
        </ExternalLink>{" "}
        for this, but it's often easier and more performant to use{" "}
        <code>rowProps</code>:
      </div>
      <Code code={CODE_MORE} transparent={false} />
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

const CODE_BASE = `
import { List } from 'react-window';

function Example() {
  return (
    <div style={{ height: 150px }}>
      <List
        rowComponent={Row}
        rowCount={100}
        rowHeight={25}
      />
    </div>
  );
}

function Row({ index, style }) {
  return (
    <div style={style}>
      Row {index}
    </div>
  )
}
`;

const CODE_MORE = `
function Example() {
  return (
    <List
      rowComponent={Row}
      rowProps={{ names }}
      {...rest}
    />
  );
}

// This component receives an additional "names" prop
// because it was passed to List as part of the "rowProps" object
function Row({ index, names, style }) {
  return (
    <div style={style}>
      {names[index]}
    </div>
  )
}
`;
