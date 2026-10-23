import { Box, Code, Header } from "react-lib-tools";
import ScrollingIndicatorScrollElementMarkdown from "../../../public/generated/examples/ScrollingIndicatorScrollElement.json";
import { Link } from "../../components/Link";

export default function UseIsScrollingWindowRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header
        section="Hooks"
        title="Tracking window scrolling with useIsScrolling"
      />
      <div>
        For lists that{" "}
        <Link to="/list/scroll-element">scroll with the page</Link>, pass the
        string <code>"window"</code> instead of the list's element:
      </div>
      <Code html={ScrollingIndicatorScrollElementMarkdown.html} />
    </Box>
  );
}
