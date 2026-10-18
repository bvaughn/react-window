import {
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  SectionHeader
} from "react-lib-tools";
import SsrDefaultHeightMarkdown from "../../../public/generated/examples/SsrDefaultHeight.json";
import { Link } from "../../components/Link";

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
      <div>Click below for more guidance about server rendering.</div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/server-rendering/server-components">
            Server rendering with React Server Components
          </Link>
        </li>
        <li className="list-disc">
          <Link to="/server-rendering/dynamic-row-heights">
            Server rendering with dynamic row heights
          </Link>
        </li>
        <li className="list-disc">
          <Link to="/server-rendering/initial-scroll-position">
            Server rendering with an initial scroll position
          </Link>
        </li>
      </ul>
    </Box>
  );
}
