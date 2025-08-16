import { VariableList, type RowComponentProps } from "react-window";
import exampleJS from "../../../../examples/VariableList.example.jsx?raw";
import exampleTS from "../../../../examples/VariableList.example.tsx?raw";
import { Block } from "../../../components/Block";
import { Box } from "../../../components/Box";
import { Callout } from "../../../components/Callout";
import { CodeTabs } from "../../../components/code/CodeTabs";
import { ExternalLink } from "../../../components/ExternalLink";
import { names } from "../../../data";
import { cn } from "../../../utils/cn";

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
      <CodeTabs codeJavaScript={exampleJS} codeTypeScript={exampleTS} />
      <Callout intent="warning">
        As with the <code>List</code> component, unless an explicit pixel height
        is provided (using the using <code>style</code> prop), a{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          ResizeObserver
        </ExternalLink>{" "}
        will be used to calculate the available space.
      </Callout>
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
