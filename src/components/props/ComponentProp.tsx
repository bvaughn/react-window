import type { ComponentPropMetadata } from "../../types";
import { Code } from "../code/Code";
import { DocsSection } from "../DocsSection";

export function ComponentProp({ prop }: { prop: ComponentPropMetadata }) {
  return (
    <>
      <dt className="mt-6 pl-8 indent-[-1rem]">
        <Code
          className="bg-transparent inline-flex flex-col p-0"
          html={prop.html}
        />
      </dt>
      <dd className="mt-2 pl-4 [&_code]:text-sky-300">
        <DocsSection sections={prop.description} />
      </dd>
    </>
  );
}
