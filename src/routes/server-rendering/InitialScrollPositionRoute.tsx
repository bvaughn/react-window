import { Box, Callout, Code, Header } from "react-lib-tools";
import SsrDefaultScrollOffsetMarkdown from "../../../public/generated/examples/SsrDefaultScrollOffset.json";

export default function InitialScrollPositionRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Other"
        title="Server rendering with an initial scroll position"
      />
      <div>
        Use the <code>defaultScrollOffset</code> prop (or the{" "}
        <code>defaultScrollLeft</code> and <code>defaultScrollTop</code> props
        for grids) to set the initial scroll position.
      </div>
      <Code html={SsrDefaultScrollOffsetMarkdown.html} />
      <Callout intent="primary">
        HTML can't be pre-scrolled, so the server always renders the first rows
        of the list. The default scroll offset is applied once the page hydrates
        (or, for lists that are initially empty, once they have rows), unless
        the list has already been scrolled (e.g. by the browser restoring a
        previous scroll position).
      </Callout>
    </Box>
  );
}
