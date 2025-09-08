import json from "../../../public/data/names.json";
import FixedHeightListMarkdown from "../../../public/generated/code-snippets/FixedHeightList.json";
import FixedHeightRowComponentMarkdown from "../../../public/generated/code-snippets/FixedHeightRowComponent.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { Code } from "../../components/code/Code";
import { ContinueLink } from "../../components/ContinueLink";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";
import { Example } from "./examples/FixedHeightList.example";

export default function FixedRowHeightsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Fixed row heights" />
      <div>
        The simplest type of list to render is one with fixed row heights.
      </div>
      <Block className="h-50" data-focus-within="bold">
        <Example names={json} />
      </Block>
      <div>
        To render this type of list, you need to specify how many rows it
        contains (<code>rowCount</code>), which component should render rows (
        <code>rowComponent</code>), and the height of each row (
        <code>rowHeight</code>):
      </div>
      <Code html={FixedHeightListMarkdown.html} />
      <div>
        The <code>rowProps</code> object can also be used to share between
        components. Values passed in <code>rowProps</code> will also be passed
        as props to the row component:
      </div>
      <Code html={FixedHeightRowComponentMarkdown.html} />
      <Callout intent="warning">
        <Box direction="column" gap={4}>
          <div>
            Lists require vertical space to render rows. Typically the{" "}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
              ResizeObserver
            </ExternalLink>{" "}
            API is used to determine how much space there is available within
            the parent DOM element.
          </div>
          <div>
            If an explicit height is specified (in pixels) using the{" "}
            <code>style</code> prop, <code>ResizeObserver</code> will not be
            used.
          </div>
        </Box>
      </Callout>
      <ContinueLink
        to="/list/variable-row-height"
        title="variable row heights"
      />
    </Box>
  );
}
