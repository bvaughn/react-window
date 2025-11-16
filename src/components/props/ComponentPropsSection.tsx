import { Fragment } from "react/jsx-runtime";
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
      <dl className="flex flex-col gap-2">
        {props.map((prop) => (
          <Fragment key={prop.name}>
            <dt className="mt-6 pl-8 indent-[-1rem]">
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
              {prop.infos.map((info, index) => (
                <Callout
                  className="mt-4"
                  key={index}
                  html
                  intent="primary"
                  minimal
                >
                  {info}
                </Callout>
              ))}
              {prop.warnings.map((warning, index) => (
                <Callout
                  className="mt-4"
                  key={index}
                  html
                  intent="warning"
                  minimal
                >
                  {warning}
                </Callout>
              ))}
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
