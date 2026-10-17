import {
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  SectionHeader
} from "react-lib-tools";
import RowComponentMarkdown from "../../public/generated/examples/RowComponent.json";
import SsrClientWrapperMarkdown from "../../public/generated/examples/SsrClientWrapper.json";
import SsrDefaultHeightMarkdown from "../../public/generated/examples/SsrDefaultHeight.json";
import SsrDefaultScrollOffsetMarkdown from "../../public/generated/examples/SsrDefaultScrollOffset.json";
import SsrInitialRowHeightsMarkdown from "../../public/generated/examples/SsrInitialRowHeights.json";
import SsrServerComponentPageMarkdown from "../../public/generated/examples/SsrServerComponentPage.json";

export default function ServerRenderingRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Server rendering" />
      <div>
        <code>List</code> and <code>Grid</code> can be rendered on the server
        (including static site generation and{" "}
        <ExternalLink href="https://react.dev/reference/rsc/server-components">
          React Server Components
        </ExternalLink>
        ). Server-rendered rows are visible before JavaScript has loaded, and
        they hydrate without mismatches.
      </div>
      <SectionHeader>Sizing</SectionHeader>
      <div>
        Lists and grids normally measure their available space using a{" "}
        <code>ResizeObserver</code>, but there is nothing to measure on the
        server. Instead, use the <code>defaultHeight</code> prop (and{" "}
        <code>defaultWidth</code> prop for grids) to tell react-window how much
        space to fill. This determines how many rows (and columns) are server
        rendered.
      </div>
      <Code html={SsrDefaultHeightMarkdown.html} />
      <div>
        Alternatively, specify an explicit pixel size using the{" "}
        <code>style</code> prop (e.g. <code>style={"{{ height: 400 }}"}</code>).
        This size is used on both the server and the client, so no measurement
        is needed at all.
      </div>
      <Callout intent="warning">
        Without a default size, only the first row (and any overscan rows) will
        be server rendered. Once the page hydrates, the list will measure itself
        and render the remaining rows.
      </Callout>
      <Callout intent="warning">
        Percentage-based sizes (e.g. <code>rowHeight="25%"</code>) can't be
        resolved without a size. Unless a default size (or a pixel size via the{" "}
        <code>style</code> prop) is specified, they are server rendered with a
        size of 0 and rows will overlap until the page hydrates.
      </Callout>
      <Callout intent="primary">
        The default size only determines how many rows are rendered before the
        list has been measured; the list's actual size is still determined by
        CSS. To server render more rows than are visible (e.g. for crawlers that
        don't run JavaScript), set <code>defaultHeight</code> to a value larger
        than the list's height. The extra rows will be removed once the page
        hydrates, but keep in mind that hydration cost grows with the number of
        rows rendered.
      </Callout>
      <SectionHeader>React Server Components</SectionHeader>
      <div>
        <code>List</code> and <code>Grid</code> are client components, but they
        can be rendered directly by a Server Component as long as all of their
        props can be sent from the server to the client:
      </div>
      <Code html={SsrServerComponentPageMarkdown.html} />
      <div>
        The <code>rowComponent</code> (or <code>cellComponent</code>) must be a
        client component, marked with the <code>"use client"</code> directive.
        Values in <code>rowProps</code> (or <code>cellProps</code>) must be{" "}
        <ExternalLink href="https://react.dev/reference/rsc/use-client#serializable-types">
          serializable
        </ExternalLink>
        .
      </div>
      <Code html={RowComponentMarkdown.html} />
      <div>
        Functions can't be passed from the server to the client, so props like{" "}
        <code>rowHeight</code> functions, <code>rowKey</code>,{" "}
        <code>onRowsRendered</code>, <code>onResize</code>, and{" "}
        <code>listRef</code> (as well as hooks like{" "}
        <code>useDynamicRowHeight</code>) need to be used within a client
        component:
      </div>
      <Code html={SsrClientWrapperMarkdown.html} />
      <SectionHeader>Dynamic row heights</SectionHeader>
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
      <SectionHeader>Initial scroll position</SectionHeader>
      <div>
        Use the <code>defaultScrollOffset</code> prop (or the{" "}
        <code>defaultScrollLeft</code> and <code>defaultScrollTop</code> props
        for grids) to set the initial scroll position.
      </div>
      <Code html={SsrDefaultScrollOffsetMarkdown.html} />
      <Callout intent="primary">
        HTML can't be pre-scrolled, so the server always renders the first rows
        of the list. The default scroll offset is applied once the page hydrates
        (or, for lists that are initially empty, once they have rows), unless
        the list has already been scrolled (e.g. by the browser restoring a
        previous scroll position).
      </Callout>
      <SectionHeader>Right to left content</SectionHeader>
      <div>
        Grids inherit their direction from ancestor elements, but this can't be
        detected on the server. Specify the <code>dir</code> prop explicitly for
        server-rendered right-to-left grids.
      </div>
      <SectionHeader>Scrollbar size</SectionHeader>
      <div>
        <code>getScrollbarSize</code> returns <code>0</code> on the server. To
        avoid hydration mismatches, read it after the component has mounted
        (e.g. within an effect) instead of during render.
      </div>
    </Box>
  );
}
