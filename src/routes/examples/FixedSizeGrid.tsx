import { Block } from "../../components/Block";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";

export function FixedSizeGrid() {
  return (
    <ExampleLayout>
      <Block>TODO</Block>
      <Code code={CODE} />
    </ExampleLayout>
  );
}

const CODE = `
import { FixedSizeGrid as Grid } from 'react-window';
 
const Cell = ({ columnIndex, rowIndex, style }) => (
  <div style={style}>
    Item {rowIndex},{columnIndex}
  </div>
);
 
const Example = () => (
  <Grid
    columnCount={1000}
    columnWidth={100}
    height={150}
    rowCount={1000}
    rowHeight={35}
    width={300}
  >
    {Cell}
  </Grid>
);
`;
