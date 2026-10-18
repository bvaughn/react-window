import { Box, Code, ExternalLink, Header } from "react-lib-tools";
import RowComponentMarkdown from "../../../public/generated/examples/RowComponent.json";
import SsrClientWrapperMarkdown from "../../../public/generated/examples/SsrClientWrapper.json";
import SsrServerComponentPageMarkdown from "../../../public/generated/examples/SsrServerComponentPage.json";

export default function ServerComponentsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Other"
        title="Server rendering with React Server Components"
      />
      <div>
        <code>List</code> and <code>Grid</code> are client components, but they
        can be rendered directly by a{" "}
        <ExternalLink href="https://react.dev/reference/rsc/server-components">
          Server Component
        </ExternalLink>{" "}
        as long as all of their props can be sent from the server to the client:
      </div>
      <Code html={SsrServerComponentPageMarkdown.html} />
      <div>
        The <code>rowComponent</code> (or <code>cellComponent</code>) must be a
        client component, marked with the <code>"use client"</code> directive.
        Values in <code>rowProps</code> (or <code>cellProps</code>) must be{" "}
        <ExternalLink href="https://react.dev/reference/rsc/use-client#serializable-types">
          serializable
        </ExternalLink>
        .
      </div>
      <Code html={RowComponentMarkdown.html} />
      <div>
        Functions can't be passed from the server to the client, so props like{" "}
        <code>rowHeight</code> functions, <code>rowKey</code>,{" "}
        <code>onRowsRendered</code>, <code>onResize</code>, and{" "}
        <code>listRef</code> (as well as hooks like{" "}
        <code>useDynamicRowHeight</code>) need to be used within a client
        component:
      </div>
      <Code html={SsrClientWrapperMarkdown.html} />
    </Box>
  );
}
