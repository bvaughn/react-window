import { Box, Code, Header } from "react-lib-tools";
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
        If row heights are known ahead of time (e.g. measured during a previous
        visit) they can be provided to <code>useDynamicRowHeight</code> using
        the <code>initialRowHeights</code> option. These heights are used in
        place of the default height until rows are measured.
      </div>
      <Code html={SsrInitialRowHeightsMarkdown.html} />
    </Box>
  );
}
