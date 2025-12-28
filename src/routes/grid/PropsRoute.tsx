import { Box, ComponentProps } from "react-lib-tools";
import json from "../../../public/generated/docs/Grid.json";
import type { ComponentMetadata } from "../../types";

export default function GridPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Grids" />
    </Box>
  );
}
