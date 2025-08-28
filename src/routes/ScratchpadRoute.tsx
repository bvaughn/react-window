import { useState } from "react";
import {
  Grid,
  useGridCallbackRef,
  type Align,
  type CellComponentProps
} from "react-window";
import { Block } from "../components/Block";
import { Box } from "../components/Box";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { Select, type Option } from "../components/Select";
import { cn } from "../utils/cn";

const ALIGNMENTS: Option<Align>[] = (
  ["auto", "center", "end", "smart", "start"] satisfies Align[]
).map((value) => ({
  label: `align: ${value}`,
  value
}));

export function ScratchpadRoute() {
  const [rtl, setRtl] = useState(false);
  const [columnIndex, setColumnIndex] = useState<number | undefined>();
  const [rowIndex, setRowIndex] = useState<number | undefined>();
  const [gridRef, setGridRef] = useGridCallbackRef(null);
  const [align, setAlign] = useState(ALIGNMENTS[0]);

  return (
    <Box direction="column" gap={4}>
      <Box
        align="center"
        direction="row"
        gap={4}
        onKeyDown={(event) => {
          switch (event.key) {
            case "Enter": {
              if (columnIndex !== undefined && rowIndex !== undefined) {
                gridRef?.scrollToCell({
                  columnAlign: align.value,
                  columnIndex,
                  rowAlign: align.value,
                  rowIndex
                });
              } else if (columnIndex !== undefined) {
                gridRef?.scrollToColumn({
                  align: align.value,
                  index: columnIndex
                });
              } else if (rowIndex !== undefined) {
                gridRef?.scrollToRow({
                  align: align.value,
                  index: rowIndex
                });
              }
              break;
            }
          }
        }}
      >
        <Select
          className="flex-1"
          onChange={setAlign}
          options={ALIGNMENTS}
          placeholder="Align"
          value={align}
        />
        <Checkbox checked={rtl} onChange={setRtl} />
        <Input
          autoFocus
          className="grow"
          min={0}
          max={99}
          onChange={(value) => {
            const parsed = parseInt(value);
            setColumnIndex(isNaN(parsed) ? undefined : parsed);
          }}
          placeholder="Column"
          step={1}
          type="number"
          value={columnIndex === undefined ? "" : "" + columnIndex}
        />
        <Input
          autoFocus
          className="grow"
          min={0}
          max={99}
          onChange={(value) => {
            const parsed = parseInt(value);
            setRowIndex(isNaN(parsed) ? undefined : parsed);
          }}
          placeholder="Row"
          step={1}
          type="number"
          value={rowIndex === undefined ? "" : "" + rowIndex}
        />
      </Box>
      <Block className="w-full h-100" data-focus-within="bold">
        <Grid
          cellComponent={CellComponent}
          cellProps={{
            focusedColumnIndex: columnIndex,
            focusedRowIndex: rowIndex
          }}
          columnCount={100}
          columnWidth={75}
          dir={rtl ? "rtl" : undefined}
          key={rtl ? "rtl" : "ltr"}
          gridRef={setGridRef}
          rowCount={100}
          rowHeight={35}
        />
      </Block>
    </Box>
  );
}

function CellComponent({
  columnIndex,
  focusedColumnIndex,
  focusedRowIndex,
  rowIndex,
  style
}: CellComponentProps<{
  focusedColumnIndex: number | undefined;
  focusedRowIndex: number | undefined;
}>) {
  return (
    <div
      className={cn("flex items-center justify-center text-xs", {
        "bg-slate-900": columnIndex % 2 === rowIndex % 2,
        "bg-slate-800":
          columnIndex === focusedColumnIndex || rowIndex === focusedRowIndex
      })}
      style={style}
    >
      row {rowIndex}, col {columnIndex}
    </div>
  );
}
