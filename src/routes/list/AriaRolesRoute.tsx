import { Box, Code, ExternalLink, Header } from "react-lib-tools";
import ListAriaRolesMarkdown from "../../../public/generated/examples/ListAriaRoles.json";
import RowComponentAriaRolesMarkdown from "../../../public/generated/examples/RowComponentAriaRoles.json";
import { ContinueLink } from "../../components/ContinueLink";

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
      <Code html={ListAriaRolesMarkdown.html} />
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
      <Code html={RowComponentAriaRolesMarkdown.html} />
      <ContinueLink to="/list/props" title="props and api" />
    </Box>
  );
}
