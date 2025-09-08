import CellComponentAriaRolesMarkdown from "../../../public/generated/code-snippets/CellComponentAriaRoles.json";
import GridAriaRolesMarkdown from "../../../public/generated/code-snippets/GridAriaRoles.json";
import { Box } from "../../components/Box";
import { HtmlCode } from "../../components/code/HtmlCode";
import { TypeScriptCode } from "../../components/code/TypeScriptCode";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";

export default function AriaRolesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Grids" title="ARIA roles" />
      <div>
        The ARIA{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/grid_role">
          grid role
        </ExternalLink>{" "}
        can be used to identify an element that contains one or more rows of
        cells.
      </div>
      <HtmlCode markdown={GridAriaRolesMarkdown} />
      <div>
        The <code>Grid</code> component automatically adds this role to the root
        HTMLDivElement it renders, but because individual cells are rendered by
        your code- you must assign ARIA attributes to those elements.
      </div>
      <div>
        To simplify this, the recommended ARIA attributes are passed to the{" "}
        <code>cellComponent</code> in the form of the{" "}
        <code>ariaAttributes</code> prop. The easiest way to use them is just to
        pass them through like so:
      </div>
      <TypeScriptCode markdown={CellComponentAriaRolesMarkdown} />
    </Box>
  );
}
