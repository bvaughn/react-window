import type { ImperativeHandleMethodMetadata } from "../../types";
import { Code } from "../code/Code";
import { DocsSection } from "../DocsSection";

export function ImperativeHandleMethod({
  method
}: {
  method: ImperativeHandleMethodMetadata;
}) {
  return (
    <>
      <dd className="[&_code]:text-sky-300 text-lg font-bold">{method.name}</dd>
      <dt className="mt-2">
        <DocsSection sections={method.description} />
        <Code className="mt-2 p-2 flex flex-col" html={method.html} />
      </dt>
    </>
  );
}
