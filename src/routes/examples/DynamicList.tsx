import { Block } from "../../components/Block";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";

export function DynamicListRoute() {
  return (
    <ExampleLayout>
      <Block>TODO</Block>
      <Code code={CODE_VERTICAL} />
      <Block>TODO</Block>
      <Code code={CODE_HORIZONTAL} />
    </ExampleLayout>
  );
}

DynamicListRoute.path = "/examples/dynamic-list";

const CODE_VERTICAL = `
import { VariableSizeList as List } from 'react-window';
 
// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));
 
const getItemSize = index => rowHeights[index];
 
const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);
 
const Example = () => (
  <List
    height={150}
    itemCount={1000}
    itemSize={getItemSize}
    width={300}
  >
    {Row}
  </List>
);
`;

const CODE_HORIZONTAL = `
import { VariableSizeList as List } from 'react-window';
 
// These column widths are arbitrary.
// Yours should be based on the content of the column.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
 
const getItemSize = index => columnWidths[index];
 
const Column = ({ index, style }) => (
  <div style={style}>Column {index}</div>
);
 
const Example = () => (
  <List
    height={75}
    itemCount={1000}
    itemSize={getItemSize}
    layout="horizontal"
    width={300}
  >
    {Column}
  </List>
);
`;
