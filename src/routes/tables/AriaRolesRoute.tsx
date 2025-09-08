import TableAriaAttributesMarkdown from "../../../public/generated/code-snippets/TableAriaAttributes.json";
import TableAriaOverridePropsMarkdown from "../../../public/generated/code-snippets/TableAriaOverrideProps.json";
import { Box } from "../../components/Box";
import { Code } from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";

export default function AriaRolesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Tables" title="ARIA roles" />
      <div>
        The default ARIA role set by the <code>List</code> component is{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/list_role">
          list
        </ExternalLink>{" "}
        , but the{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/table_role">
          table
        </ExternalLink>{" "}
        role is more appropriate for tabular data.
      </div>
      <Code html={TableAriaAttributesMarkdown.html} />
      <div>
        The example on the previous page can be modified like so to assign the
        correct ARIA attributes:
      </div>
      <Code html={TableAriaOverridePropsMarkdown.html} />
    </Box>
  );
}
