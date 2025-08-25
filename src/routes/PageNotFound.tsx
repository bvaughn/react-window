import { Box } from "../components/Box";
import { Callout } from "../components/Callout";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";

export function PageNotFound() {
  return (
    <Box direction="column" gap={4}>
      <Header title="Page not found" />
      <Callout intent="danger">
        The URL you requested can't be found. If you think this is an error,{" "}
        <ExternalLink href="https://github.com/bvaughn/react-window/issues/new">
          please file a GitHub issue
        </ExternalLink>
        .
      </Callout>
    </Box>
  );
}
