import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import InfiniteFeedMarkdown from "../../../public/generated/examples/InfiniteFeed.json";
import { Example } from "./examples/InfiniteFeed";

export default function InfiniteLoadingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Infinite loading" />
      <div>
        Lists that load their data as the user scrolls can use the{" "}
        <code>onRowsRendered</code> callback to decide when to load more. For
        example, a feed can load the next page when the user scrolls near the
        end. Scroll the activity feed below to load more updates:
      </div>
      <Block className="h-75" data-focus-within="bold">
        <Example />
      </Block>
      <Code html={InfiniteFeedMarkdown.html} />
      <Callout intent="warning">
        Loading state prevents the same page from being requested more than once
        while the user scrolls.
      </Callout>
    </Box>
  );
}
