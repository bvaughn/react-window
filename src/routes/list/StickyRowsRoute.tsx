import {
  Block,
  Box,
  Callout,
  Code,
  ExternalLink,
  Header
} from "react-lib-tools";
import ListWithStickyRowsMarkdown from "../../../public/generated/examples/ListWithStickyRows.json";
import { Example } from "./examples/ListWithStickyRows.example";

export default function StickyRowsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Sticky rows" />
      <div>
        If you want to render content on top of your list or grid, the safest
        method is to use a{" "}
        <ExternalLink href="https://react.dev/reference/react-dom/createPortal">
          portal
        </ExternalLink>{" "}
        and render them directly into the parent document. This avoids potential
        clipping issues or z-index conflicts.
      </div>
      <div>
        For the specific case of "sticky" rows, you can render within the parent
        list or grid using the <code>children</code> prop:
      </div>
      <Block className="h-50" data-focus-within="bold">
        <Example />
      </Block>
      <div>The example above was created using code like this:</div>
      <Code html={ListWithStickyRowsMarkdown.html} />
      <Callout intent="warning">
        <strong>Note</strong> the height of 0 in the example above prevents the
        sticky row from affecting the height of the parent list.
      </Callout>
    </Box>
  );
}
