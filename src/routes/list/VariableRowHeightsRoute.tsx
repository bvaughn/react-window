import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { FormattedCode } from "../../components/code/FormattedCode";
import { ContinueLink } from "../../components/ContinueLink";
import { Header } from "../../components/Header";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Example } from "./examples/ListVariableRowHeights.example";
import { useCitiesByState } from "./hooks/useCitiesByState";

export function VariableRowHeightsRoute() {
  const citiesByState = useCitiesByState();

  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Variable row heights" />
      <div>
        Lists with rows of different types may require different heights to
        render.
      </div>
      <div>
        Here is an example the most populous US postal codes, grouped by state.
        State rows "headers" are taller and are styled differently.
      </div>
      <Block className="h-50" data-focus-within="bold">
        {!citiesByState.length && <LoadingSpinner />}
        <Example items={citiesByState} />
      </Block>
      <div>
        This list requires a <code>rowHeight</code> function that tells it what
        height a row should be based on the type of data it contains.
      </div>
      <FormattedCode url="/generated/code-snippets/ListVariableRowHeights.json" />
      <ContinueLink to="/list/dynamic-row-height" title="dynamic row heights" />
    </Box>
  );
}
