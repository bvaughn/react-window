import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { FormattedCode } from "../../components/code/FormattedCode";
import { ContinueLink } from "../../components/ContinueLink";
import { ExternalLink } from "../../components/ExternalLink";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { RtlExample } from "./examples/RtlGrid.example";
import { useContacts } from "./hooks/useContacts";

export function RTLGridsRoute() {
  const contacts = useContacts();

  return (
    <Box direction="column" gap={4}>
      <div>
        As with any grids, this type of list can also be display RTL scripts.
      </div>
      <div>
        Using the same data as from the previous example, here is a grid
        rendered with <code>dir</code> attribute "rtl" .
      </div>
      <Block className="h-50 overflow-auto" data-focus-within="bold">
        {!contacts.length && <LoadingSpinner />}
        <RtlExample contacts={contacts} />
      </Block>
      <FormattedCode url="/generated/code-snippets/RtlGrid.json" />
      <Callout intent="primary">
        <strong className="text-sky-300">Note</strong> the <code>dir</code>{" "}
        attribute may be set on the root HTML element or passed as an explicit
        prop.{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir">
          Learn more
        </ExternalLink>
        …
      </Callout>
      <ContinueLink to="/grid/horizontal-lists" title="horizontal lists" />
    </Box>
  );
}
