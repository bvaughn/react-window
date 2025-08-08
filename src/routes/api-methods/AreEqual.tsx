import { Block } from "../../components/Block";
import { Callout } from "../../components/Callout";
import Code from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";

export function AreEqual() {
  return (
    <div className="flex flex-col gap-4">
      <Block>
        Custom comparison function for React{" "}
        <ExternalLink href="https://react.dev/reference/react/memo">
          memo
        </ExternalLink>
        . If your item renderer is a class component, use the{" "}
        <ExternalLink href="https://react.dev/reference/react/Component#shouldcomponentupdate">
          shouldComponentUpdate
        </ExternalLink>{" "}
        method instead.
      </Block>
      <Block>
        This function knows to compare individual style props and ignore the
        wrapper object in order to avoid unnecessarily re-rendering when cached
        style objects are reset.
      </Block>
      <Code code={CODE} language="TypeScript" />
      <Callout intent="success">
        This is an advanced performance optimization. It is not necessary in
        most cases.
      </Callout>
    </div>
  );
}

AreEqual.path = "/api/areEqual";

const CODE = `
import React, { memo } from "react";
 
// Step 1: Import areEqual from react-window
import { areEqual } from "react-window";
 
const Row = memo(
  props => {
    const { index, style } = props;
 
    return <div style={style}>Row {index}</div>;
  },
 
  // Step 2: Pass it as the second argument to React.memo()
  areEqual
);
`;
