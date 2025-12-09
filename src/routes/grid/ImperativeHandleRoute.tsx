import { html as useGridCallbackRefHTML } from "../../../public/generated/code-snippets/useGridCallbackRef.json";
import { html as useGridRefHTML } from "../../../public/generated/code-snippets/useGridRef.json";
import json from "../../../public/generated/js-docs/GridImperativeAPI.json";
import { Box } from "../../components/Box";
import { Code } from "../../components/code/Code";
import { ExternalLink } from "../../components/ExternalLink";
import { ImperativeHandle } from "../../components/handles/ImperativeHandle";
import type { ImperativeHandleMetadata } from "../../types";

export default function GridImperativeHandleRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={json as ImperativeHandleMetadata}
        section="Imperative API"
      />
      <div className="text-lg font-bold">Hooks</div>
      <div>
        The <code>useGridRef</code> hook returns a{" "}
        <ExternalLink href="https://react.dev/reference/react/useRef">
          mutable ref object
        </ExternalLink>
        .
      </div>
      <Code html={useGridRefHTML} />
      <div>
        And the <code>useGridCallbackRef</code> hook returns a{" "}
        <ExternalLink href="https://react.dev/reference/react-dom/components/common#ref-callback">
          ref callback function
        </ExternalLink>
        . This is better when sharing the ref with another hook or component.
      </div>
      <Code html={useGridCallbackRefHTML} />
    </Box>
  );
}
