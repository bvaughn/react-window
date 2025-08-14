import { Box } from "../components/Box";
import { Callout } from "../components/Callout";
import { ExternalLink } from "../components/ExternalLink";
import { Link } from "../components/Link";

export function GettingStartedRoute() {
  return (
    <Box direction="column" gap={4}>
      <Callout intent="warning">
        This library require the{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          <code>ResizeObserver</code> API
        </ExternalLink>{" "}
        (or polyfill).
      </Callout>
      <div>To install from NPM:</div>
      <code className="text-xs md:text-sm block text-left whitespace-pre-wrap rounded-md p-3 bg-black text-white!">
        npm install <span className="tok-keyword">react-window</span>
      </code>
      <div>
        TypeScript definitions and component documentation are both included
        within the published <code>dist</code> folder.
      </div>
      <div>There are two types of components to choose from:</div>
      <ul className="pl-8">
        <li className="list-disc">
          <Link to="/list/fixed-row-height">Lists</Link> (vertical scrolling)
        </li>
        <li className="list-disc">
          <Link to="/grid/grid">Grids</Link> (horizontal and vertical scrolling)
        </li>
      </ul>
      <div>
        You'll find examples and documentation for both types of components
        here. If you have questions you can ask on GitHub, (but please search
        through the{" "}
        <ExternalLink href="https://github.com/bvaughn/react-window/issues?q=is%3Aissue%20state%3Aclosed">
          issues that have already been answered
        </ExternalLink>{" "}
        before opening a new one).
      </div>
    </Box>
  );
}
