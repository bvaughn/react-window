import FlexboxLayoutMarkdown from "../../../public/generated/code-snippets/FlexboxLayout.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { TypeScriptCode } from "../../components/code/TypeScriptCode";
import { ContinueLink } from "../../components/ContinueLink";
import { Header } from "../../components/Header";
import { Link } from "../../components/Link";
import { LoadingSpinner } from "../../components/LoadingSpinner";
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
      <TypeScriptCode markdown={FlexboxLayoutMarkdown} />
      <Callout intent="primary">
        It may be more efficient to render data with many columns using the{" "}
        <Link to="/grid/grid">Grid</Link> component.
      </Callout>
      <ContinueLink to="/list/tabular-data-aria-roles" title="ARIA roles" />
    </Box>
  );
}
