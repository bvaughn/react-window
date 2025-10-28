import type { ComponentPropMetadata } from "../../types";
import { Callout } from "../Callout";
import { Code } from "../code/Code";

export function ComponentPropsSection({
  header,
  props
}: {
  header: string;
  props: ComponentPropMetadata[];
}) {
  if (props.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="text-lg font-bold mt-2">{header}</div>
      <dl>
        {props.map((prop) => (
          <div key={prop.name}>
            <dt className="mt-4 mb-2 pl-8 indent-[-1rem]">
              <Code
                className="bg-transparent inline-block p-0"
                html={prop.html}
              />
            </dt>
            <dd className="ml-4 [&_code]:text-sky-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: prop.description
                }}
              ></div>
              {prop.info && (
                <Callout className="mt-4" html intent="primary" minimal>
                  {prop.info}
                </Callout>
              )}
              {prop.warning && (
                <Callout className="mt-4" html intent="warning" minimal>
                  {prop.warning}
                </Callout>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
