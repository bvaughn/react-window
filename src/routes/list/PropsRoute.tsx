import { Box } from "../../components/Box";
import { ContinueLink } from "../../components/ContinueLink";
import { ComponentProps } from "../../components/props/ComponentProps";
import json from "../../../public/generated/js-docs/List.json";

export default function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps section="Lists" json={json} />
      <ContinueLink to="/list/imperative-api" title="imperative api" />
    </Box>
  );
}
