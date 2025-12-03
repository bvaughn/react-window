import json from "../../../public/generated/js-docs/Grid.json";
import { Box } from "../../components/Box";
import { ComponentProps } from "../../components/props/ComponentProps";
import type { ComponentMetadata } from "../../types";

export default function GridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Grids" />
    </Box>
  );
}
