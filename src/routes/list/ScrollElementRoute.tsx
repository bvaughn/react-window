import { Block, Box, Callout, Code, Header } from "react-lib-tools";
import GridWithWindowScrollMarkdown from "../../../public/generated/examples/GridWithWindowScroll.json";
import ListWithScrollElementMarkdown from "../../../public/generated/examples/ListWithScrollElement.json";
import ListWithWindowScrollMarkdown from "../../../public/generated/examples/ListWithWindowScroll.json";
import { Link } from "../../components/Link";
import { useContacts } from "../grid/hooks/useContacts";
import { Example } from "./examples/ListWithScrollElement";

export default function ScrollElementRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Scrolling with the page" />
      <div>
        By default, lists and grids scroll their own content. To scroll a list
        along with the rest of the page instead (e.g. a feed), pass{" "}
        <code>"window"</code> as the <code>scrollElement</code> prop:
      </div>
      <Code html={ListWithWindowScrollMarkdown.html} />
      <div>
        The list renders at its full height and only renders the rows that are
        visible within the viewport. Its position on the page is measured
        whenever it renders, scrolls, or resizes, and whenever content before it
        is resized, inserted, or removed (e.g. an image loading above it).
      </div>
      <div>
        A list can also scroll along with other content inside of a scrollable
        element. Pass the element as the <code>scrollElement</code> prop (it
        will be <code>null</code> until it has mounted). For example, the
        activity feed below scrolls along with the content above and below it:
      </div>
      <Block className="h-75" data-focus-within="bold">
        <Example contacts={contacts} />
      </Block>
      <Code html={ListWithScrollElementMarkdown.html} />
      <div>
        The <Link to="/list/imperative-handle">imperative API</Link> scrolls the
        scroll element, and <Link to="/list/sticky-rows">sticky rows</Link>{" "}
        stick to the top of the scroll element.
      </div>
      <div>
        Grids support this prop too. Rows scroll with the scroll element;
        columns also scroll with it if the grid is as wide as its content.
        Otherwise the grid fills the width of its parent and its columns scroll
        within it.
      </div>
      <Code html={GridWithWindowScrollMarkdown.html} />
      <Callout intent="primary">
        <Box direction="column" gap={4}>
          <div>When a scroll element is provided:</div>
          <ul className="list-disc pl-6">
            <li>
              <code>defaultHeight</code> (and <code>defaultWidth</code> for
              grids) are used as the viewport size until the scroll element has
              been measured (e.g. during server rendering)
            </li>
            <li>
              Percentage row heights (and column widths) are relative to the
              scroll element's viewport
            </li>
            <li>
              Default scroll offsets are ignored; the list doesn't control the
              scroll element's position
            </li>
          </ul>
        </Box>
      </Callout>
    </Box>
  );
}
