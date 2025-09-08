import HorizontalListMarkdown from "../../../public/generated/code-snippets/HorizontalList.json";
import HorizontalListCellRendererMarkdown from "../../../public/generated/code-snippets/HorizontalListCellRenderer.json";
import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { TypeScriptCode } from "../../components/code/TypeScriptCode";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { HorizontalList } from "./examples/HorizontalList.example";
import { useEmails } from "./hooks/useEmails";

export default function HorizontalListsRoute() {
  const emails = useEmails();

  return (
    <Box direction="column" gap={4}>
      <div>A horizontal list is just a grid with only one row.</div>
      <div>Here's an example horizontal list (grid) of emails:</div>
      <Block className="h-20" data-focus-within="bold">
        {!emails.length && <LoadingSpinner />}
        <HorizontalList emails={emails} />
      </Block>
      <div>Here's what the configuration for the grid above looks like:</div>
      <TypeScriptCode markdown={HorizontalListMarkdown} />
      <div>And here's the cell renderer:</div>
      <TypeScriptCode markdown={HorizontalListCellRendererMarkdown} />
    </Box>
  );
}
