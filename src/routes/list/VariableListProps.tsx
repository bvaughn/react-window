import json from "../../../docs/VariableList.json";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { ComponentHeader } from "../../components/ComponentHeader";
import { PropsBlocks } from "../../components/PropsBlocks";

export function VariableListPropsRoute() {
  return (
    <Box direction="column" gap={4}>
      <ComponentHeader json={json} />
      <Callout intent="primary">
        This component accepts a generic <code>rowProps</code> object that will
        be spread and passed to the <code>rowComponent</code> as additional
        props. Refer to the example for more information.
      </Callout>
      <Callout intent="primary">
        The only difference between this and the (fixed row height){" "}
        <code>List</code> component is the <code>rowHeight</code> prop.
      </Callout>
      <PropsBlocks json={json} />
    </Box>
  );
}
