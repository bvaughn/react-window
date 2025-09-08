import { useMemo, useState } from "react";
import { List, useListRef, type Align } from "react-window";
import listRefClickEventHandlerMarkdown from "../../../public/generated/code-snippets/listRefClickEventHandler.json";
import useListCallbackRefMarkdown from "../../../public/generated/code-snippets/useListCallbackRef.json";
import useListRefMarkdown from "../../../public/generated/code-snippets/useListRef.json";
import useListRefImportMarkdown from "../../../public/generated/code-snippets/useListRefImport.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Button } from "../../components/Button";
import { Callout } from "../../components/Callout";
import { TypeScriptCode } from "../../components/code/TypeScriptCode";
import { Header } from "../../components/Header";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Select, type Option } from "../../components/Select";
import { RowComponent } from "./examples/ListVariableRowHeights.example";
import { rowHeight } from "./examples/rowHeight.example";
import { useCitiesByState } from "./hooks/useCitiesByState";
import { ContinueLink } from "../../components/ContinueLink";

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

export default function ListImperativeApiRoute() {
  const [align, setAlign] = useState<Option<Align> | undefined>();
  const [behavior, setBehavior] = useState<
    Option<ScrollBehavior> | undefined
  >();
  const [state, setState] = useState<Option<string>>(EMPTY_OPTION);

  const citiesByState = useCitiesByState();

  const stateOptions = useMemo<Option<string>[]>(() => {
    const options: Option<string>[] = citiesByState
      .filter((item) => item.type === "state")
      .map((item) => ({
        label: item.state,
        value: item.state
      }));
    options.unshift(EMPTY_OPTION);

    return options;
  }, [citiesByState]);

  const listRef = useListRef(null);

  const scrollToRow = () => {
    const index = citiesByState.findIndex(
      (item) => item.type === "state" && item.state === state.value
    );
    listRef.current?.scrollToRow({
      align: align?.value,
      behavior: behavior?.value,
      index
    });
  };

  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Imperative API" />
      <div>
        List provides an imperative API for responding to events. The
        recommended way to access this API is to use the exported ref hook:
      </div>
      <TypeScriptCode markdown={useListRefImportMarkdown} />
      <div>Attach the ref during render:</div>
      <TypeScriptCode markdown={useListRefMarkdown} />
      <div>And call API methods in an event handler:</div>
      <TypeScriptCode markdown={listRefClickEventHandlerMarkdown} />
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
          onChange={setState}
          options={stateOptions}
          placeholder="State"
          value={state}
        />
        <Button
          className="shrink-0"
          disabled={!state.value}
          onClick={scrollToRow}
        >
          Scroll
        </Button>
      </Box>
      <Block className="h-50" data-focus-within="bold">
        {!citiesByState.length && <LoadingSpinner />}
        <List
          listRef={listRef}
          rowComponent={RowComponent}
          rowCount={citiesByState.length}
          rowHeight={rowHeight}
          rowProps={{ items: citiesByState }}
        />
      </Block>
      <Callout intent="primary">
        <strong className="text-sky-300">Note</strong> If you are passing the
        ref to another component or hook, use the ref callback function instead.
      </Callout>
      <TypeScriptCode markdown={useListCallbackRefMarkdown} />
      <ContinueLink to="/list/aria-roles" title="ARIA roles" />
    </Box>
  );
}
