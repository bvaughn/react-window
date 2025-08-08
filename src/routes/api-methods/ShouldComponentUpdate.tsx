import { Link } from "react-router-dom";
import { Block } from "../../components/Block";
import { Callout } from "../../components/Callout";
import Code from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";
import { AreEqual } from "./AreEqual";

export function ShouldComponentUpdate() {
  return (
    <div className="flex flex-col gap-4">
      <Block>
        Custom{" "}
        <ExternalLink href="https://react.dev/reference/react/Component#shouldcomponentupdate">
          shouldComponentUpdate
        </ExternalLink>{" "}
        implementation for class components. If your item renderer is a
        functional component, use the <Link to={AreEqual.path}>areEqual</Link>{" "}
        comparison method instead.
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

const CODE = `
import React, { Component } from "react";
 
// Step 1: Import shouldComponentUpdate from react-window
import { shouldComponentUpdate } from "react-window";
 
class Row extends Component {
  // Step 2: Bind the sCU method to the component instance
  shouldComponentUpdate = shouldComponentUpdate.bind(this);
 
  render() {
    const { index, style } = this.props;
 
    return <div style={style}>Row {index}</div>;
  }
}
`;
