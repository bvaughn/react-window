import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Callout } from "../../components/Callout";
import { FormattedCode } from "../../components/code/FormattedCode";
import { ContinueLink } from "../../components/ContinueLink";
import { ExternalLink } from "../../components/ExternalLink";
import { Header } from "../../components/Header";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Example } from "./examples/FixedHeightList.example";
import { useNames } from "./hooks/useNames";

export function FixedRowHeightsRoute() {
  const names = useNames();

  return (
    <Box direction="column" gap={4}>
      <Header section="Lists" title="Fixed row heights" />
      <div>
        The simplest type of list to render is one with fixed row heights.
      </div>
      <Block className="h-50" data-focus-within="bold">
        {!names.length && <LoadingSpinner />}
        <Example names={names} />
      </Block>
      <div>
        The <code>rowProps</code> object can be used to share data with rows:
      </div>
      <FormattedCode url="/generated/code-snippets/FixedHeightList.json" />
      <div>
        Values passed in <code>rowProps</code> will be passed as props to the
        row component:
      </div>
      <FormattedCode url="/generated/code-snippets/FixedHeightRowComponent.json" />
      <Callout intent="warning">
        <Box direction="column" gap={4}>
          <div>
            Lists require vertical space to render rows. Typically the{" "}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">
              ResizeObserver
            </ExternalLink>{" "}
            API is used to determine how much space there is available within
            the parent DOM element.
          </div>
          <div>
            If an explicit height is specified (in pixels) using the{" "}
            <code>style</code> prop, <code>ResizeObserver</code> will not be
            used.
          </div>
        </Box>
      </Callout>
      <ContinueLink
        to="/list/variable-row-height"
        title="variable row heights"
      />
    </Box>
  );
}
