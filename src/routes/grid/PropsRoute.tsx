import { Box } from "../../components/Box";
import { ContinueLink } from "../../components/ContinueLink";
import { ComponentProps } from "../../components/props/ComponentProps";

export default function GridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps section="Grids" url="/generated/js-docs/Grid.json" />
      <ContinueLink to="/grid/imperative-api" title="imperative api" />
    </Box>
  );
}
