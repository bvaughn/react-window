import { Box } from "../../components/Box";
import { ContinueLink } from "../../components/ContinueLink";
import { ComponentProps } from "../../components/props/ComponentProps";
import json from "../../../public/generated/js-docs/Grid.json";

export default function GridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps section="Grids" json={json} />
      <ContinueLink to="/grid/imperative-api" title="imperative api" />
    </Box>
  );
}
