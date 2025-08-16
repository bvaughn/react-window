import { List, type RowComponentProps } from "react-window";
import exampleJS from "../../../../examples/List.example.jsx?raw";
import exampleTS from "../../../../examples/List.example.tsx?raw";
import exampleTwoJS from "../../../../examples/ListRowProps.example.jsx?raw";
import exampleTwoTS from "../../../../examples/ListRowProps.example.tsx?raw";
import { Block } from "../../../components/Block";
import { Box } from "../../../components/Box";
import { Callout } from "../../../components/Callout";
import { CodeTabs } from "../../../components/code/CodeTabs";
import { ExternalLink } from "../../../components/ExternalLink";
import { names } from "../../../data";

export function ListOverviewRoute() {
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
      <CodeTabs codeJavaScript={exampleJS} codeTypeScript={exampleTS} />
      <Callout intent="primary">
        Lists will automatically render enough rows to fill their parent
        container, but an explicit height can also be set using the{" "}
        <code>className</code> or <code>style</code> props.
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
      <CodeTabs codeJavaScript={exampleTwoJS} codeTypeScript={exampleTwoTS} />
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
  return (
    <div className="flex items-center" style={style}>
      {names[index]}
    </div>
  );
}
