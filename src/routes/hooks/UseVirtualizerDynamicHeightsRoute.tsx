import { Block, Box, Code, Header } from "react-lib-tools";
import HeadlessDynamicSizesMarkdown from "../../../public/generated/examples/HeadlessDynamicSizes.json";
import { Link } from "../../components/Link";
import { useChatMessages } from "../list/hooks/useChatMessages";
import { Example } from "./examples/HeadlessDynamicSizes";

export default function UseVirtualizerDynamicHeightsRoute() {
  const messages = useChatMessages();

  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        title="Rendering items with dynamic heights with useVirtualizer"
      />
      <div>
        Items with{" "}
        <Link to="/list/dynamic-row-height">dynamic row heights</Link> (like the
        messages in the chat log below) must be passed to the{" "}
        <code>measureElement</code> ref callback and specify a{" "}
        <code>data-index</code> attribute:
      </div>
      <Block className="h-75" data-focus-within="bold">
        <Example messages={messages} />
      </Block>
      <Code html={HeadlessDynamicSizesMarkdown.html} />
    </Box>
  );
}
