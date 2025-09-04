import { Box } from "../../components/Box";
import ListAriaRolesMarkdown from "../../../public/generated/code-snippets/ListAriaRoles.json";
import RowComponentAriaRolesMarkdown from "../../../public/generated/code-snippets/RowComponentAriaRoles.json";
import { FormattedCode } from "../../components/code/FormattedCode";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";

export default function AriaRolesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="ARIA roles" />
      <div>
        The ARIA{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/list_role">
          list role
        </ExternalLink>{" "}
        can be used to identify a list of items.
      </div>
      <FormattedCode markdown={ListAriaRolesMarkdown} />
      <div>
        The <code>List</code> component automatically adds this role to the root
        HTMLDivElement it renders, but because individual rows are rendered by
        your code- you must assign ARIA attributes to those elements.
      </div>
      <div>
        To simplify this, the recommended ARIA attributes are passed to the{" "}
        <code>rowComponent</code> in the form of the <code>ariaAttributes</code>{" "}
        prop. The easiest way to use them is just to pass them through like so:
      </div>
      <FormattedCode markdown={RowComponentAriaRolesMarkdown} />
    </Box>
  );
}
