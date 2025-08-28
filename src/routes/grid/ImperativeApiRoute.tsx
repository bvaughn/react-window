import { useMemo, useState } from "react";
import { Grid, useGridRef, type Align } from "react-window";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Button } from "../../components/Button";
import { Callout } from "../../components/Callout";
import { FormattedCode } from "../../components/code/FormattedCode";
import { Header } from "../../components/Header";
import { Select, type Option } from "../../components/Select";
import { CellComponent } from "./examples/CellComponent.example";
import { columnWidth } from "./examples/columnWidth.example";
import type { Contact } from "./examples/Grid.example";
import { COLUMN_KEYS } from "./examples/shared";
import { useContacts } from "./hooks/useContacts";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const EMPTY_OPTION: Option<string> = {
  label: "",
  value: ""
};

const ALIGNMENTS: Option<Align>[] = (
  ["auto", "center", "end", "smart", "start"] satisfies Align[]
).map((value) => ({
  label: `align: ${value}`,
  value
}));
ALIGNMENTS.unshift(EMPTY_OPTION as Option<Align>);

const BEHAVIORS: Option<ScrollBehavior>[] = (
  ["auto", "instant", "smooth"] satisfies ScrollBehavior[]
).map((value) => ({
  label: `behavior: ${value}`,
  value
}));
BEHAVIORS.unshift(EMPTY_OPTION as Option<ScrollBehavior>);

const COLUMNS: Option<string>[] = COLUMN_KEYS.map((key) => ({
  label: key,
  value: key
})).sort((a, b) => a.label.localeCompare(b.label));

export function GridImperativeApiRoute() {
  const contacts = useContacts();

  const titleOptions = useMemo<Option<string>[]>(() => {
    const options: Option<string>[] = [];
    if (contacts) {
      contacts
        .reduce((array, contact) => {
          if (!array.includes(contact.title)) {
            array.push(contact.title);
          }
          return array;
        }, new Array<string>())
        .sort()
        .forEach((title) => {
          options.push({
            label: title,
            value: title
          });
        });

      options.unshift(EMPTY_OPTION);
    }

    return options;
  }, [contacts]);

  const [align, setAlign] = useState<Option<Align> | undefined>();
  const [behavior, setBehavior] = useState<
    Option<ScrollBehavior> | undefined
  >();
  const [column, setColumn] = useState<Option<string>>(EMPTY_OPTION);
  const [title, setTitle] = useState<Option<string>>(EMPTY_OPTION);

  const gridRef = useGridRef(null);

  const scrollToRow = () => {
    const grid = gridRef.current;
    if (grid) {
      const columnIndex = column?.value
        ? COLUMN_KEYS.indexOf(column.value as keyof Contact)
        : undefined;

      const rowIndex = title?.value
        ? contacts.findIndex((row) => row.title === title.value)
        : undefined;

      if (columnIndex !== undefined && rowIndex !== undefined) {
        grid.scrollToCell({
          behavior: behavior?.value,
          columnAlign: align?.value,
          columnIndex,
          rowAlign: align?.value,
          rowIndex
        });
      } else if (columnIndex !== undefined) {
        grid.scrollToColumn({
          align: align?.value,
          behavior: behavior?.value,
          index: columnIndex
        });
      } else if (rowIndex !== undefined) {
        grid.scrollToRow({
          align: align?.value,
          behavior: behavior?.value,
          index: rowIndex
        });
      }
    }
  };

  return (
    <Box direction="column" gap={4}>
      <Header section="Grids" title="Imperative API" />
      <div>
        Grid provides an imperative API for responding to events. The
        recommended way to access this API is to use the exported ref hook:
      </div>
      <FormattedCode url="/generated/code-snippets/useGridRefImport.json" />
      <div>Attach the ref during render:</div>
      <FormattedCode url="/generated/code-snippets/useGridRef.json" />
      <div>And call API methods in an event handler:</div>
      <FormattedCode url="/generated/code-snippets/gridRefClickEventHandler.json" />
      <div>The form below uses the imperative API to scroll the list:</div>
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
        <Select
          className="flex-1"
          onChange={setTitle}
          options={titleOptions}
          placeholder="Job title"
          value={title}
        />
        <Select
          className="flex-1"
          onChange={setColumn}
          options={COLUMNS}
          placeholder="Column"
          value={column}
        />
        <Button
          className="shrink-0"
          disabled={!column.value && !title.value}
          onClick={scrollToRow}
        >
          Scroll
        </Button>
      </Box>
      <Block className="h-50" data-focus-within="bold">
        {!contacts.length && <LoadingSpinner />}
        <Grid
          cellComponent={CellComponent}
          cellProps={{ contacts }}
          columnCount={COLUMNS.length}
          columnWidth={columnWidth}
          gridRef={gridRef}
          rowCount={contacts.length}
          rowHeight={25}
        />
      </Block>
      <div>
        The Grid API also provides <code>scrollToColumn</code> and{" "}
        <code>scrollToRow</code> methods for single-axis scrolling.
      </div>
      <Callout intent="primary">
        <strong className="text-sky-300">Note</strong> If you are passing the
        ref to another component or hook, use the ref callback function instead.
      </Callout>
      <FormattedCode url="/generated/code-snippets/useGridCallbackRef.json" />
    </Box>
  );
}
