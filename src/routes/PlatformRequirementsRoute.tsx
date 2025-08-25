import { Box } from "../components/Box";
import { Callout } from "../components/Callout";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";

export function PlatformRequirementsRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header title="Requirements" />
      <div>
        This library requires React{" "}
        <ExternalLink href="https://react.dev/blog/2022/03/29/react-v18">
          version 18
        </ExternalLink>{" "}
        or newer.
      </div>
      <div>
        It also uses the{" "}
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
          ResizeObserver
        </ExternalLink>{" "}
        (or a polyfill) to calculate the available space for <code>List</code>{" "}
        and <code>Grid</code> components.
      </div>
      <Callout intent="primary">
        <code>ResizeObserver</code> usage can be avoided if explicit pixel
        dimensions are specified using the <code>style</code> prop. (Percentage
        or EM/REM based dimensions do not count.)
      </Callout>
    </Box>
  );
}
