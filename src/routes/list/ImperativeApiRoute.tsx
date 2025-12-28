import {
  Box,
  Code,
  ExternalLink,
  ImperativeHandle,
  type ImperativeHandleMetadata
} from "react-lib-tools";
import json from "../../../public/generated/docs/ListImperativeAPI.json";
import { html as useListCallbackRefHTML } from "../../../public/generated/examples/useListCallbackRef.json";
import { html as useListRefHTML } from "../../../public/generated/examples/useListRef.json";

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
