import { Block, Box, Button, Callout, Code, Header } from "react-lib-tools";
import ListPinnedToBottomMarkdown from "../../../public/generated/examples/ListPinnedToBottom.json";
import ListRowPinnedToBottomMarkdown from "../../../public/generated/examples/ListRowPinnedToBottom.json";
import { Link } from "../../components/Link";
import { Example } from "./examples/ListPinnedToBottom";
import { useStreamingChatMessages } from "./hooks/useStreamingChatMessages";

export default function PinnedToBottomRoute() {
  const { messages, restart, restartCount, typing } =
    useStreamingChatMessages();

  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Pinned to bottom" />
      <div>
        Chat logs and other streaming content often keep the list scrolled to
        the bottom as new rows arrive, unless the user has scrolled up to read
        older content.
      </div>
      <Block className="h-100" data-focus-within="bold">
        <Example key={restartCount} messages={messages} typing={typing} />
      </Block>
      <div>
        <Button onClick={restart}>Reset demo chat</Button>
      </div>
      <div>
        This example builds on{" "}
        <Link to="/list/dynamic-row-height">dynamic row heights</Link>. Each
        time a row is added (or measured) the list smoothly scrolls to the
        bottom, as long as the user hasn't scrolled away from it.
      </div>
      <Code html={ListPinnedToBottomMarkdown.html} />
      <Callout>
        Dynamic-height lists ignore smooth scrolling for{" "}
        <code>scrollToRow</code>, so this example scrolls the list element
        directly instead.
      </Callout>
      <Code html={ListRowPinnedToBottomMarkdown.html} />
    </Box>
  );
}
