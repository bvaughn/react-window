import json from "../../../public/generated/js-docs/List.json";
import { Box } from "../../components/Box";
import { ComponentProps } from "../../components/props/ComponentProps";

export default function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentProps json={json} section="Lists" />
    </Box>
  );
}
