import CellComponentMarkdown from "../../../public/generated/code-snippets/CellComponent.json";
import columnWidthMarkdown from "../../../public/generated/code-snippets/FixedHeightList.json";
import GridMarkdown from "../../../public/generated/code-snippets/Grid.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { TypeScriptCode } from "../../components/code/TypeScriptCode";
import { ContinueLink } from "../../components/ContinueLink";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Example } from "./examples/Grid.example";
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
      <TypeScriptCode markdown={GridMarkdown} />
      <div>
        Column widths and row heights can be either numbers or functions. In the
        example above, row height is fixed and column width is variable.
      </div>
      <TypeScriptCode markdown={columnWidthMarkdown} />
      <div>
        Lastly grids require a component to render cell, given a column and row
        index. As with lists, this component receives additional props specified
        as part of <code>cellProps</code>:
      </div>
      <TypeScriptCode markdown={CellComponentMarkdown} />
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
      <ContinueLink to="/grid/props" title="component props" />
    </Box>
  );
}
