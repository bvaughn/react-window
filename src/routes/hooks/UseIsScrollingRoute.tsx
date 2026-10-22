import { Block, Box, Code, Header, SectionHeader } from "react-lib-tools";
import json from "../../../public/data/names.json";
import ScrollingIndicatorMarkdown from "../../../public/generated/examples/ScrollingIndicator.json";
import ScrollingIndicatorScrollElementMarkdown from "../../../public/generated/examples/ScrollingIndicatorScrollElement.json";
import { Link } from "../../components/Link";
import { Example } from "./examples/ScrollingIndicator";

export default function UseIsScrollingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Hooks" title="useIsScrolling" />
      <div>
        The <code>useIsScrolling</code> hook tracks whether a list is scrolling.
        Rows can use this value to render simplified content while scrolling, as
        shown below.
      </div>
      <Block className="h-50" data-focus-within="bold">
        <Example names={json} />
      </Block>
      <div>
        Scrolling ends when the browser fires a <code>scrollend</code> event.
        Browsers that don't support that event wait until no scroll events have
        been received for a short delay (150ms by default; configurable with the{" "}
        <code>delay</code> option).
      </div>
      <SectionHeader>Common case</SectionHeader>
      <div>
        In most cases, the <code>useIsScrolling</code> hook should be passed a
        reference to the list <code>HTMLElement</code>:
      </div>
      <Code html={ScrollingIndicatorMarkdown.html} />
      <SectionHeader>Scrolling with the window</SectionHeader>
      <div>
        For lists that{" "}
        <Link to="/list/scroll-element">scroll with the page</Link> , pass the
        string <code>"window"</code> instead:
      </div>
      <Code html={ScrollingIndicatorScrollElementMarkdown.html} />
    </Box>
  );
}
