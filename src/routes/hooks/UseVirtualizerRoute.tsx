import {
  Block,
  Box,
  Callout,
  Code,
  Header,
  LoadingSpinner,
  SectionHeader
} from "react-lib-tools";
import json from "../../../public/data/names.json";
import HeadlessDynamicSizesMarkdown from "../../../public/generated/examples/HeadlessDynamicSizes.json";
import HeadlessListMarkdown from "../../../public/generated/examples/HeadlessList.json";
import HeadlessTableMarkdown from "../../../public/generated/examples/HeadlessTable.json";
import { Link } from "../../components/Link";
import { useLorem } from "../list/hooks/useLorem";
import { useAddresses } from "../tables/hooks/useAddresses";
import { Example as HeadlessDynamicSizesExample } from "./examples/HeadlessDynamicSizes";
import { Example as HeadlessListExample } from "./examples/HeadlessList";
import { Example as HeadlessTableExample } from "./examples/HeadlessTable";

export default function UseVirtualizerRoute() {
  const addresses = useAddresses();
  const lorem = useLorem();

  return (
    <Box direction="column" gap={4}>
      <Header section="Hooks" title="useVirtualizer" />
      <div>
        The <code>List</code> and <code>Grid</code> components render their own
        markup. To render custom markup instead (e.g. a{" "}
        <code>&lt;table&gt;</code>
        ), use the <code>useVirtualizer</code> hook. It calculates which items
        to render and where; how they are rendered is up to you.
      </div>
      <Block className="h-50" data-focus-within="bold">
        <HeadlessListExample names={json} />
      </Block>
      <Code html={HeadlessListMarkdown.html} />
      <div>
        The hook returns the items to render (each with an <code>index</code>,{" "}
        <code>offset</code>, and <code>size</code>), the <code>totalSize</code>{" "}
        of all items, the <code>visibleRange</code>, and a{" "}
        <code>scrollToIndex</code> method. Its options mirror the props of{" "}
        <code>List</code>: <code>count</code>, <code>itemSize</code>,{" "}
        <code>overscanCount</code>, <code>direction</code>,{" "}
        <code>scrollElement</code>, and <code>onItemsRendered</code>.
      </div>
      <SectionHeader>Tables</SectionHeader>
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
          <HeadlessTableExample addresses={addresses} />
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
      <SectionHeader>Dynamic sizes</SectionHeader>
      <div>
        Items with{" "}
        <Link to="/list/dynamic-row-height">dynamic row heights</Link> must be
        passed to the <code>measureElement</code> ref callback and specify a{" "}
        <code>data-index</code> attribute:
      </div>
      <Block className="h-50" data-focus-within="bold">
        {!lorem.length && <LoadingSpinner />}
        <HeadlessDynamicSizesExample lorem={lorem} />
      </Block>
      <Code html={HeadlessDynamicSizesMarkdown.html} />
    </Box>
  );
}
