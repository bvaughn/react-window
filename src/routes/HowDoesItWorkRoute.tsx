import { Box, Callout, Code, ExternalLink, Header } from "react-lib-tools";
import BasicRowMarkdown from "../../public/generated/examples/BasicRow.json";
import { AnimatedList } from "./components/animated/AnimatedList";

export default function HowDoesItWorkRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header title="How does it work?" />
      <div>
        Libraries like this help to render a lot of items as efficiently as
        possible by limiting how many items are rendered at once.
      </div>
      <div>
        Here is an over-simplified illustration of a list with 5 rows. Only 2 or
        3 rows are rendered at a time because that is enough to fill the
        viewport. (The user can't see the other rows, so we don't <em>need</em>{" "}
        to render them).
      </div>
      <Box align="center" direction="row" justify="center">
        <AnimatedList rowCount={5} />
      </Box>
      <div>
        When a user scrolls the list, a different set of rows are rendered- but
        always only a few at a time.
      </div>
      <Callout intent="primary">
        The illustration above shows unrendered rows as dimmed. In reality, they
        aren't there at all. The rows that do get rendered are positioned using
        CSS properties like{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/top">
          top
        </ExternalLink>{" "}
        to mimic other rows above them.
      </Callout>
      <div>
        To render one of these rows, all you need to provide is a component like
        the one below.
      </div>
      <Code html={BasicRowMarkdown.html} />
    </Box>
  );
}
