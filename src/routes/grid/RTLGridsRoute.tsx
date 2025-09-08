import RtlGridMarkdown from "../../../public/generated/code-snippets/RtlGrid.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Code } from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { RtlExample } from "./examples/RtlGrid.example";
import { useContacts } from "./hooks/useContacts";

export default function RTLGridsRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <div>
        Grids can also display right to left languages (like Arabic). The grid
        components check the{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir">
          <code>dir</code> attribute
        </ExternalLink>{" "}
        to determine content directionality.
      </div>
      <div>
        Using the same data as from the previous example, here is a grid
        rendered right to left.
      </div>
      <Block className="h-50 overflow-auto" data-focus-within="bold">
        {!contacts.length && <LoadingSpinner />}
        <RtlExample contacts={contacts} />
      </Block>
      <Code html={RtlGridMarkdown.html} />
    </Box>
  );
}
