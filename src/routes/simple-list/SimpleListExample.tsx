import { SimpleList, type RowProps } from "react-window";
import { Block } from "../../components/Block";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";
import { names } from "../../data";

export function SimpleListExampleRoute() {
  return (
    <ExampleLayout
      code={<Code code={CODE} />}
      demo={
        <Block className="h-35">
          <SimpleList
            length={names.length}
            rowComponent={Row}
            rowHeight={25}
            rowProps={{ names }}
          />
        </Block>
      }
    ></ExampleLayout>
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
import { SimpleList } from 'react-window';

function ListOfNames({ names }) {
  return (
    <SimpleList
      length={names.length}
      rowComponent={Row}
      rowHeight={25}
      rowProps={{ names }}
      style={{ height: 140 }}
    />
  );
}

function Row({ index, names, style }) {
  return (
    <div style={style}>{names[index]}</div>
  )
}
`;
