import { Block, Box, Code, Header } from "react-lib-tools";
import json from "../../../public/data/names.json";
import HeadlessListMarkdown from "../../../public/generated/examples/HeadlessList.json";
import { Link } from "../../components/Link";
import { Example } from "./examples/HeadlessList";

export default function UseVirtualizerListsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Hooks" title="Rendering a list with useVirtualizer" />
      <div>
        The <code>useVirtualizer</code> hook returns the items to render (each
        with an <code>index</code>, <code>offset</code>, and <code>size</code>)
        along with the <code>totalSize</code> of all items. Items can be
        absolutely positioned within an element of that size:
      </div>
      <Block className="h-50" data-focus-within="bold">
        <Example names={json} />
      </Block>
      <Code html={HeadlessListMarkdown.html} />
      <div>
        Refer to the <Link to="/hooks/use-virtualizer">useVirtualizer</Link>{" "}
        page for the full list of parameters and return values.
      </div>
    </Box>
  );
}
