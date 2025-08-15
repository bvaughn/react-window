import { VariableList, type RowComponentProps } from "react-window";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import Code from "../../components/code/Code";
import { names } from "../../data";
import { cn } from "../../utils/cn";

type Item = { type: "header"; value: string } | { type: "item"; value: string };

const items: Item[] = [];

let currentLetter = "";

names.forEach((name) => {
  const char = name.charAt(0);
  if (currentLetter !== char) {
    currentLetter = char;
    items.push({ type: "header", value: char });
  }
  items.push({ type: "item", value: name });
});

type RowProps = {
  items: Item[];
};

export function VariableListRoute() {
  return (
    <Box direction="column" gap={4}>
      <div>
        Lists with rows of different types may require different heights to
        render. The <code>VariableList</code> can be used to render this type of
        data.
      </div>
      <Block className="h-50" data-focus-within="bold">
        <VariableList
          rowComponent={RowComponent}
          rowCount={items.length}
          rowHeight={rowHeight}
          rowProps={{ items }}
        />
      </Block>
      <div>
        This list requires a <code>rowHeight</code> function that tells it what
        height a row should be based on the type of data it contains.
      </div>
      <Code code={CODE_BASE} language="TSX" />
    </Box>
  );
}

function rowHeight(index: number, { items }: RowProps) {
  return items[index].type === "header" ? 35 : 25;
}

function RowComponent({
  index,
  items,
  style,
}: RowComponentProps<{
  items: Item[];
}>) {
  return (
    <div
      className={cn("flex items-center", {
        "text-3xl text-sky-300": items[index].type === "header",
      })}
      style={style}
    >
      {items[index].value}
    </div>
  );
}

const CODE_BASE = `
import { VariableList, type RowComponentProps } from 'react-window';

type Item =
  | { type: "header"; value: string }
  | { type: "item"; value: string };

type RowProps = {
  items: Item[];
};

function Example({ items }) {
  return (
    <VariableList
      rowComponent={RowComponent}
      rowCount={names.length}
      rowHeight={rowHeight}
      rowProps={{ items } satisfies RowProps}
    />
  );
}

function rowHeight(index: number, { items }: RowProps) {
  return items[index].type === "header" ? 35 : 25;
}

function RowComponent({ index, items, style }: RowComponentProps<RowProps>) {
  return (
    <div style={style}>
      {items[index].value}
    </div>
  );
}

`;
