import {
  Block,
  Box,
  Callout,
  Code,
  ExternalLink,
  Header,
  LoadingSpinner
} from "react-lib-tools";
import CellComponentMarkdown from "../../../public/generated/examples/CellComponent.json";
import columnWidthMarkdown from "../../../public/generated/examples/columnWidth.json";
import GridMarkdown from "../../../public/generated/examples/Grid.json";
import { ContinueLink } from "../../components/ContinueLink";
import { Example } from "./examples/Grid";
import { useContacts } from "./hooks/useContacts";

export default function RenderingGridRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <Header section="Grids" title="Rendering a grid" />
      <div>
        Use the <code>Grid</code> component to render data with many rows and
        columns:
      </div>
      <Block className="h-50 overflow-auto" data-focus-within="bold">
        {!contacts.length && <LoadingSpinner />}
        <Example contacts={contacts} />
      </Block>
      <div>
        Grids require you to specify the number of rows and columns as well as
        the width and height of each:
      </div>
      <Code html={GridMarkdown.html} />
      <div>
        Column widths and row heights can be either numbers or functions. In the
        example above, row height is fixed and column width is function that
        determines the width of the column based on the column index:
      </div>
      <Code html={columnWidthMarkdown.html} />
      <div>
        Lastly grids require a component to render cell, given a column and row
        index. As with lists, this component receives additional props specified
        as part of <code>cellProps</code>:
      </div>
      <Code html={CellComponentMarkdown.html} />
      <Callout intent="warning">
        <Box direction="column" gap={4}>
          <div>
            Grids require space to render cells. Typically the{" "}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
              ResizeObserver
            </ExternalLink>{" "}
            API is used to determine how much space there is available within
            the parent DOM element.
          </div>
          <div>
            If an explicit width and height are specified (in pixels) using the{" "}
            <code>style</code> prop, <code>ResizeObserver</code> will not be
            used.
          </div>
        </Box>
      </Callout>
      <ContinueLink to="/list/imperative-handle" title="imperative methods" />
    </Box>
  );
}
