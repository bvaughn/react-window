import { Box, ComponentProps } from "react-lib-tools";
import json from "../../../public/generated/docs/List.json";
import type { ComponentMetadata } from "../../types";

export default function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json as ComponentMetadata} section="Lists" />
    </Box>
  );
}
