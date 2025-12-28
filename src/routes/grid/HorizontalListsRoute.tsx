import { Block, Box, Code, Header, LoadingSpinner } from "react-lib-tools";
import HorizontalListMarkdown from "../../../public/generated/examples/HorizontalList.json";
import HorizontalListCellRendererMarkdown from "../../../public/generated/examples/HorizontalListCellRenderer.json";
import { HorizontalList } from "./examples/HorizontalList";
import { useEmails } from "./hooks/useEmails";

export default function HorizontalListsRoute() {
  const emails = useEmails();

  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Horizontal lists" />
      <div>A horizontal list is just a grid with only one row.</div>
      <div>Here's an example horizontal list (grid) of emails:</div>
      <Block className="h-20" data-focus-within="bold">
        {!emails.length && <LoadingSpinner />}
        <HorizontalList emails={emails} />
      </Block>
      <div>Here's what the configuration for the grid above looks like:</div>
      <Code html={HorizontalListMarkdown.html} />
      <div>And here's the cell renderer:</div>
      <Code html={HorizontalListCellRendererMarkdown.html} />
    </Box>
  );
}
