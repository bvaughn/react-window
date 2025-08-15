import { useState } from "react";
import {
  VariableList,
  useVariableListRef,
  type Align,
  type RowComponentProps,
} from "react-window";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Button } from "../../components/Button";
import Code from "../../components/code/Code";
import { Input } from "../../components/Input";
import { Select, type Option } from "../../components/Select";
import { cn } from "../../utils/cn";

const ALIGNMENTS: Option<Align>[] = (
  ["auto", "center", "end", "smart", "start"] satisfies Align[]
).map((value) => ({
  label: `align: ${value}`,
  value,
}));
const BEHAVIORS: Option<ScrollBehavior>[] = (
  ["auto", "instant", "smooth"] satisfies ScrollBehavior[]
).map((value) => ({
  label: `behavior: ${value}`,
  value,
}));

export function VariableListImperativeApiRoute() {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [align, setAlign] = useState<Option<Align> | undefined>();
  const [behavior, setBehavior] = useState<
    Option<ScrollBehavior> | undefined
  >();
  const listRef = useVariableListRef(null);

  const scrollToRow = () => {
    listRef.current?.scrollToRow({
      align: align?.value,
      behavior: behavior?.value,
      index: rowIndex ?? 0,
    });
  };

  return (
    <Box direction="column" gap={4}>
      <Code code={CODE} />
      <Box direction="row" gap={4}>
        <Select
          className="flex-1"
          onChange={setAlign}
          options={ALIGNMENTS}
          placeholder="Align"
          value={align}
        />
        <Select
          className="flex-1"
          onChange={setBehavior}
          options={BEHAVIORS}
          placeholder="Scroll behavior"
          value={behavior}
        />
      </Box>
      <Box direction="row" gap={4}>
        <Input
          className="w-full"
          onChange={(text) => {
            const parsed = parseInt(text);
            setRowIndex(
              isNaN(parsed) ? undefined : Math.max(0, Math.min(99, parsed)),
            );
          }}
          onKeyDown={(event) => {
            switch (event.key) {
              case "Enter": {
                scrollToRow();
              }
            }
          }}
          placeholder="Row index"
          value={rowIndex === undefined ? "" : "" + rowIndex}
        />
        <Button className="shrink-0" onClick={scrollToRow}>
          Scroll
        </Button>
      </Box>
      <Block className="h-50" data-focus-within="bold">
        <VariableList
          listRef={listRef}
          rowComponent={RowComponent}
          rowCount={100}
          rowHeight={rowHeight}
        />
      </Block>
    </Box>
  );
}

function rowHeight(index: number) {
  return index % 10 === 0 ? 35 : 25;
}

function RowComponent({ index, style }: RowComponentProps<object>) {
  return (
    <div
      className={cn("flex items-center", {
        "text-3xl text-sky-300": index % 10 === 0,
      })}
      style={style}
    >
      {index % 10 === 0 ? `Section ${index / 10 + 1}` : `Row index ${index}`}
    </div>
  );
}

const CODE = `
// Attaching it using the "listRef" prop

import { useVariableListRef } from "react-window";

const listRef = useVariableListRef(null);

return <VariableList listRef={listRef} {...props} />}

// Then use it to interact with the list
// e.g. Scroll to the 50th row

listRef.current.scrollToRow({ index: 49 });
`;
