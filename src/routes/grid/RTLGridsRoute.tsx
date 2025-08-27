import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { FormattedCode } from "../../components/code/FormattedCode";
import { ContinueLink } from "../../components/ContinueLink";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { RtlExample } from "./examples/RtlGrid.example";
import { useArabicCountries } from "./hooks/useArabicCountries";

export function RTLGridsRoute() {
  const arabicCountries = useArabicCountries();

  return (
    <Box direction="column" gap={4}>
      <div>
        As with any grids, this type of list can also be display RTL scripts.
      </div>
      <Block className="h-15 overflow-auto" data-focus-within="bold">
        {!arabicCountries.length && <LoadingSpinner />}
        <RtlExample countries={arabicCountries} />
      </Block>
      <FormattedCode url="/generated/code-snippets/HorizontalList.json" />
      <ContinueLink to="/grid/horizontal-lists" title="horizontal lists" />
    </Box>
  );
}
