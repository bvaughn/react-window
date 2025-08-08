import json from "../../../docs/SimpleList.json";
import { Callout } from "../../components/Callout";
import { ComponentHeader } from "../../components/ComponentHeader";
import { PropsBlocks } from "../../components/PropsBlocks";
import { PropsLayout } from "../../components/PropsLayout";

export function SimpleListPropsRoute() {
  return (
    <PropsLayout
      props={
        <>
          <ComponentHeader json={json} />
          <Callout intent="success">
            This component accepts a generic <code>rowProps</code> object that
            will be spread and passed to the <code>rowComponent</code> as
            additional props. Refer to the example for more information.
          </Callout>
          <PropsBlocks json={json} />
        </>
      }
    ></PropsLayout>
  );
}
