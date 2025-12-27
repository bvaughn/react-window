import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  LoadingSpinner
} from "react-lib-tools";
import FlexboxLayoutMarkdown from "../../../public/generated/examples/FlexboxLayout.json";
import { ContinueLink } from "../../components/ContinueLink";
import { Link } from "../../components/Link";
import { Example } from "./examples/FlexboxLayout.example";
import { useAddresses } from "./hooks/useAddresses";

export default function TabularDataRoute() {
  const addresses = useAddresses();

  return (
    <Box direction="column" gap={4}>
      <Header section="Tables" title="Rendering tabular data" />
      <div>
        Many types of tabular data can be rendered using the list component.
      </div>
      <Block className="p-0!" data-focus-within="bold">
        {!addresses.length ? (
          <div className="p-2">
            <LoadingSpinner />
          </div>
        ) : (
          <Example addresses={addresses} />
        )}
      </Block>
      <div>
        The example above uses Flexbox layout to position columns and headers.
      </div>
      <Code html={FlexboxLayoutMarkdown.html} />
      <Callout intent="primary">
        It may be more efficient to render data with many columns using the{" "}
        <Link to="/grid/grid">Grid</Link> component.
      </Callout>
      <ContinueLink to="/list/tabular-data-aria-roles" title="ARIA roles" />
    </Box>
  );
}
