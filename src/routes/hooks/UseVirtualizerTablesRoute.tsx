import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  LoadingSpinner
} from "react-lib-tools";
import HeadlessTableMarkdown from "../../../public/generated/examples/HeadlessTable.json";
import { useAddresses } from "../tables/hooks/useAddresses";
import { Example } from "./examples/HeadlessTable";

export default function UseVirtualizerTablesRoute() {
  const addresses = useAddresses();

  return (
    <Box direction="column" gap={4}>
      <Header section="Hooks" title="Rendering a table with useVirtualizer" />
      <div>
        Rows in a <code>&lt;table&gt;</code> can't be absolutely positioned.
        Instead, rows can be rendered in normal document flow, with spacer rows
        taking the place of rows that aren't rendered. Using the{" "}
        <code>&lt;tbody&gt;</code> as the element (and the scrolling container
        as the <code>scrollElement</code>) positions rows relative to the body,
        so the sticky header doesn't offset them:
      </div>
      <Block className="p-0!" data-focus-within="bold">
        {!addresses.length ? (
          <div className="p-2">
            <LoadingSpinner />
          </div>
        ) : (
          <Example addresses={addresses} />
        )}
      </Block>
      <Code html={HeadlessTableMarkdown.html} />
      <div>
        Like the browser's <code>scrollIntoView</code>,{" "}
        <code>scrollToIndex</code> aligns items within the{" "}
        <code>scroll-padding</code> of the element being scrolled. Setting{" "}
        <code>scroll-padding-top</code> to the height of the sticky header keeps
        rows from being aligned underneath it.
      </div>
      <Callout intent="primary">
        The <code>aria-rowcount</code> and <code>aria-rowindex</code> attributes
        tell assistive technologies how many rows the table has, even though
        only some of them are rendered.
      </Callout>
    </Box>
  );
}
