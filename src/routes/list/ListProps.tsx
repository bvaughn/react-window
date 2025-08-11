import json from "../../../docs/List.json";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { ComponentHeader } from "../../components/ComponentHeader";
import { PropsBlocks } from "../../components/PropsBlocks";

export function ListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentHeader json={json} />
      <Callout intent="success">
        This component accepts a generic <code>rowProps</code> object that will
        be spread and passed to the <code>rowComponent</code> as additional
        props. Refer to the example for more information.
      </Callout>
      <PropsBlocks json={json} />
    </Box>
  );
}
