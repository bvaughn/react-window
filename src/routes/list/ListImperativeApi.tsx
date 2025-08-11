import { useState } from "react";
import { List, useListRef, type Align, type RowProps } from "react-window";
import { Block } from "../../components/Block";
import { Button } from "../../components/Button";
import Code from "../../components/code/Code";
import { Input } from "../../components/Input";
import { Select, type Option } from "../../components/Select";
import { Box } from "../../components/Box";

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

export function ListImperativeApiRoute() {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [align, setAlign] = useState<Option<Align> | undefined>();
  const [behavior, setBehavior] = useState<
    Option<ScrollBehavior> | undefined
  >();
  const listRef = useListRef(null);

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
      <Block className="h-50" data-focus-within>
        <List
          length={100}
          listRef={listRef}
          rowComponent={Row}
          rowHeight={30}
        />
      </Block>
    </Box>
  );
}

function Row({ index, style }: RowProps<null>) {
  return (
    <div className="flex items-center gap-2" style={style}>
      Row index {index}
    </div>
  );
}

const CODE = `
// Attaching it using the "listRef" prop

import { useListRef } from "react-window";

const listRef = useListRef(null);

return <List listRef={listRef} {...props} />}

// Then use it to interact with the list
// e.g. Scroll to the 50th row

listRef.current.scrollToRow({ index: 49 });
`;
