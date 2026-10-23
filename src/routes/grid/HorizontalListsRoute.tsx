import { Block, Box, Code, Header } from "react-lib-tools";
import HorizontalListMarkdown from "../../../public/generated/examples/HorizontalList.json";
import HorizontalListCellRendererMarkdown from "../../../public/generated/examples/HorizontalListCellRenderer.json";
import { HorizontalList } from "./examples/HorizontalList";
import { useContacts } from "./hooks/useContacts";

export default function HorizontalListsRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Horizontal lists" />
      <div>A horizontal list is just a grid with only one row.</div>
      <div>
        Here's an example horizontal list (grid) of people you may know:
      </div>
      <Block className="h-52" data-focus-within="bold">
        <HorizontalList contacts={contacts} />
      </Block>
      <div>Here's what the configuration for the grid above looks like:</div>
      <Code html={HorizontalListMarkdown.html} />
      <div>And here's the cell renderer:</div>
      <Code html={HorizontalListCellRendererMarkdown.html} />
    </Box>
  );
}
