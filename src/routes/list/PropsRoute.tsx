import { Box } from "../../components/Box";
import { ContinueLink } from "../../components/ContinueLink";
import { ComponentProps } from "../../components/props/ComponentProps";

export function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps section="Lists" url="/generated/js-docs/List.json" />
      <ContinueLink to="/list/imperative-api" title="imperative api" />
    </Box>
  );
}
