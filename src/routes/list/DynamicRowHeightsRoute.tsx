import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import ListDynamicRowHeightsMarkdown from "../../../public/generated/examples/ListDynamicRowHeights.json";
import ListRowDynamicRowHeightsMarkdown from "../../../public/generated/examples/ListRowDynamicRowHeights.json";
import { Example } from "./examples/ListDynamicRowHeights";
import { useChatMessages } from "./hooks/useChatMessages";

export default function DynamicRowHeightsRoute() {
  const messages = useChatMessages();

  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Dynamic row heights" />
      <div>
        Sometimes the height of a row isn't known until it's been rendered. For
        example, a chat log with messages of varying length.
      </div>
      <Block className="h-100" data-focus-within="bold">
        <Example messages={messages} />
      </Block>
      <div>
        For this kind of list, react-window provides a helper hook called{" "}
        <code>useDynamicRowHeight</code>.
      </div>
      <Code html={ListDynamicRowHeightsMarkdown.html} />
      <div>
        In this case, rows can just render their content as they normally would
        and react-window will measure it for you.
      </div>
      <Code html={ListRowDynamicRowHeightsMarkdown.html} />
      <Callout intent="warning">
        Dynamic row heights are not as efficient as predetermined sizes. It's
        recommended to provide your own height values if they can be determined
        ahead of time.
      </Callout>
      <Callout>
        Dynamic-height lists scroll to the target row <strong>instantly</strong>
        , even when smooth scrolling is requested.
      </Callout>
    </Box>
  );
}
