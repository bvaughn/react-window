import { Block } from "../../components/Block";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";

export function RTLLayout() {
  return (
    <ExampleLayout>
      <Block>TODO</Block>
      <Code code={CODE_LIST} />
      <Block>TODO</Block>
      <Code code={CODE_GRID} />
    </ExampleLayout>
  );
}

const CODE_LIST = `
import { FixedSizeList as List } from 'react-window';

const Column = ({ index, style }) => (
  <div style={style}>عمود {index}</div>
);

const Example = () => (
  <List
    direction="rtl"
    height={75}
    itemCount={1000}
    itemSize={100}
    layout="horizontal"
    width={300}
  >
    {Column}
  </List>
);
`;

const CODE_GRID = `
import { FixedSizeGrid as Grid } from 'react-window';
 
const Cell = ({ columnIndex, rowIndex, style }) => (
  <div style={style}>
    بند {rowIndex},{columnIndex}
  </div>
);
 
const Example = () => (
  <Grid
    columnCount={1000}
    columnWidth={100}
    direction="rtl"
    height={150}
    rowCount={1000}
    rowHeight={35}
    width={300}
  >
    {Cell}
  </Grid>
);
`;
