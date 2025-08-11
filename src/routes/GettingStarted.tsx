import { Box } from "../components/Box";
import { Callout } from "../components/Callout";
import { ExternalLink } from "../components/ExternalLink";

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
      <code className="text-xs md:text-sm block text-left whitespace-pre-wrap rounded-md p-3 bg-black">
        npm install <span className="tok-keyword">react-window</span>
      </code>
      <div>
        TypeScript definitions and component documentation are both included
        within the published <code>dist</code> folder.
      </div>
      <div>
        If you have questions, please check already answered{" "}
        <ExternalLink href="https://github.com/bvaughn/react-window/issues?q=is%3Aissue%20state%3Aclosed">
          GitHub issues
        </ExternalLink>{" "}
        before opening a new one.
      </div>
    </Box>
  );
}
