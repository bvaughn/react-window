import json from "../../../public/generated/js-docs/ListImperativeAPI.json";
import { Box } from "../../components/Box";
import { Code } from "../../components/code/Code";
import { ImperativeHandle } from "../../components/handles/ImperativeHandle";
import type { ImperativeHandleMetadata } from "../../types";
import { html as useListRefHTML } from "../../../public/generated/code-snippets/useListRef.json";
import { html as useListCallbackRefHTML } from "../../../public/generated/code-snippets/useListCallbackRef.json";
import { ExternalLink } from "../../components/ExternalLink";

export default function ListImperativeApiRoute() {
  return (
    <Box direction="column" gap={4}>
      <ImperativeHandle
        json={json as ImperativeHandleMetadata}
        section="Imperative API"
      />
      <div className="text-lg font-bold">Hooks</div>
      <div>
        The <code>useListRef</code> hook returns a{" "}
        <ExternalLink href="https://react.dev/reference/react/useRef">
          mutable ref object
        </ExternalLink>
        .
      </div>
      <Code html={useListRefHTML} />
      <div>
        And the <code>useListCallbackRef</code> hook returns a{" "}
        <ExternalLink href="https://react.dev/reference/react-dom/components/common#ref-callback">
          ref callback function
        </ExternalLink>
        . This is better when sharing the ref with another hook or component.
      </div>
      <Code html={useListCallbackRefHTML} />
    </Box>
  );
}
