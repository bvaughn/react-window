import { Block, Box, Code, Header } from "react-lib-tools";
import ScrollingIndicatorMarkdown from "../../../public/generated/examples/ScrollingIndicator.json";
import { useContacts } from "../grid/hooks/useContacts";
import { Example } from "./examples/ScrollingIndicator";

export default function UseIsScrollingListRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        title="Tracking list scrolling with useIsScrolling"
      />
      <div>
        In most cases, the <code>useIsScrolling</code> hook should be passed a
        reference to the list <code>HTMLElement</code>.
      </div>
      <div>
        In the contacts list below, each row renders an avatar, a name, and a
        job title. While the list is scrolling, rows render lightweight
        placeholders instead:
      </div>
      <Block className="h-75" data-focus-within="bold">
        <Example contacts={contacts} />
      </Block>
      <Code html={ScrollingIndicatorMarkdown.html} />
    </Box>
  );
}
