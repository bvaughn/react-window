import { Box, Callout, Code, Header } from "react-lib-tools";
import SsrInitialRowHeightsMarkdown from "../../../public/generated/examples/SsrInitialRowHeights.json";

export default function DynamicRowHeightsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Other"
        title="Server rendering with dynamic row heights"
      />
      <div>
        Rows with dynamic heights can't be measured until they are rendered in a
        browser. Until then, server-rendered rows are displayed in normal
        document flow (rather than being positioned using estimated heights) so
        that they don't overlap or leave gaps. Once the page hydrates and rows
        have been measured, they are positioned as usual.
      </div>
      <div>
        To reduce layout shift once rows have been measured, per-row heights can
        be provided to <code>useDynamicRowHeight</code> using the{" "}
        <code>initialRowHeights</code> option. These heights are used in place
        of the default height until rows are measured. For example, they might
        be estimated from each row's content:
      </div>
      <Code html={SsrInitialRowHeightsMarkdown.html} />
      <div>
        Heights can also be measured ahead of time, e.g. by rendering the list
        in a headless browser while generating a static site. When rendering
        from a Server Component, compute the heights on the server and pass them
        as a prop to the client component that calls{" "}
        <code>useDynamicRowHeight</code>.
      </div>
      <Callout intent="primary">
        If row heights can be determined exactly ahead of time, use a{" "}
        <code>rowHeight</code> function instead; it's more efficient than
        measuring rows.
      </Callout>
      <Callout intent="warning">
        Initial heights are matched to rows by index, and dynamic heights often
        depend on the list's width (e.g. text that wraps). Heights that were
        computed for different data or a different width will cause layout shift
        once rows are measured. Changing the hook's <code>key</code> option
        re-reads <code>initialRowHeights</code>.
      </Callout>
    </Box>
  );
}
