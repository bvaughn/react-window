import { List, type RowComponentProps } from "react-window";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import Code from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";
import { Link } from "../../components/Link";
import { names } from "../../data";

export function ListRoute() {
  return (
    <Box direction="column" gap={4}>
      <div>
        The simplest type of list to render is one with fixed row heights:
      </div>
      <Block className="h-50" data-focus-within="bold">
        <List
          rowComponent={RowComponent}
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
      <Code code={CODE_BASE} />
      <Callout intent="primary">
        Lists will automatically render enough rows to fill the available
        height. Height can be controlled using <code>style</code> or{" "}
        <code>className</code> props, or it can be determined by the parent
        component's layout.
      </Callout>
      <Callout intent="warning">
        Unless an explicit pixel height is provided (using the using{" "}
        <code>style</code> prop), a{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          ResizeObserver
        </ExternalLink>{" "}
        will be used to calculate the available space.
      </Callout>
      <div>
        Rows often require more data to render. That data needs to somehow be
        passed from the parent (list) component to the row level component. You
        could use the{" "}
        <ExternalLink href="https://react.dev/learn/passing-data-deeply-with-context">
          Context API
        </ExternalLink>{" "}
        or the{" "}
        <ExternalLink href="https://react.dev/reference/react/useCallback">
          useCallback
        </ExternalLink>{" "}
        hook for this, but it's easier to use <code>rowProps</code> as shown in
        the example below:
      </div>
      <Code code={CODE_MORE} language="TSX" />
      <Callout intent="primary">
        The example above shows how to use the included TypeScript definitions
        to strongly type row component props.
      </Callout>
      <div>
        For lists of rows with different sizes,{" "}
        <Link to="/list/variable-row-height">keep reading</Link>...
      </div>
    </Box>
  );
}

function RowComponent({
  index,
  names,
  style,
}: RowComponentProps<{
  names: string[];
}>) {
  console.log("RowComponent", index);
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
        rowComponent={RowComponent}
        rowCount={100}
        rowHeight={25}
      />
    </div>
  );
}

function RowComponent({ index, style }) {
  return (
    <div style={style}>
      Row {index}
    </div>
  )
}
`;

const CODE_MORE = `
import { List, type RowComponentProps } from 'react-window';

type RowProps = {
  names: string[];
};

function Example({ names }: { names: string[] }) {
  return (
    <List
      rowComponent={Row}
      rowCount={names.length}
      rowHeight={25}
      rowProps={{ names } satisfies RowProps}
    />
  );
}

// This component receives an additional "names" prop
// because it was passed to List as part of the "rowProps" object
function RowComponent({ index, names, style }: RowComponentProps<RowProps>) {
  return (
    <div style={style}>
      {names[index]}
    </div>
  )
}
`;
