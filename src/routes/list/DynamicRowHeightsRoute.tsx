import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  LoadingSpinner
} from "react-lib-tools";
import ListDynamicRowHeightsMarkdown from "../../../public/generated/examples/ListDynamicRowHeights.json";
import ListRowDynamicRowHeightsMarkdown from "../../../public/generated/examples/ListRowDynamicRowHeights.json";
import { ContinueLink } from "../../components/ContinueLink";
import { Example } from "./examples/ListDynamicRowHeights.example";
import { useLorem } from "./hooks/useLorem";

export default function DynamicRowHeightsRoute() {
  const lorem = useLorem();

  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Dynamic row heights" />
      <div>
        Sometimes the height of a row isn't known until it's been rendered.
      </div>
      <div>
        Here is an example list of lorem ipsum text of varying sizes. Each row
        can also be toggled collapsed/expanded by clicking on the "+"/"-"
        button.
      </div>
      <Block className="h-50" data-focus-within="bold">
        {!lorem.length && <LoadingSpinner />}
        <Example lorem={lorem} />
      </Block>
      <div>
        For this kind of list, react-window provides a helper hook called{" "}
        <code>useDynamicRowHeight</code>.
      </div>
      <Code html={ListDynamicRowHeightsMarkdown.html} />
      <div>
        In this case, rows can just render their content as they normally would
        and react-window will measure it for you.
      </div>
      <Code html={ListRowDynamicRowHeightsMarkdown.html} />
      <Callout intent="warning">
        Dynamic row heights are not as efficient as predetermined sizes. It's
        recommended to provide your own height values if they can be determined
        ahead of time.
      </Callout>
      <ContinueLink to="/list/imperative-handle" title="imperative methods" />
    </Box>
  );
}
