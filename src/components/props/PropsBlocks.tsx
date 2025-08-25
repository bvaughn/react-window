import { useMemo } from "react";
import type { ComponentDoc, PropItem } from "react-docgen-typescript";
import { processPropsJSON } from "../../utils/processPropsJSON";

export function PropsBlocks({ json }: { json: ComponentDoc }) {
  const { optionalProps, requiredProps } = useMemo(
    () => processPropsJSON(json),
    [json]
  );

  return (
    <>
      <PropsBlock header="Required props" props={requiredProps} />
      <PropsBlock header="Optional props" props={optionalProps} />
    </>
  );
}

export function PropsBlock({
  header,
  props
}: {
  header: string;
  props: PropItem[];
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
            <dt className="mt-2 pl-4 indent-[-1rem]">
              <code className="tok-operator">
                <span className="tok-propertyName">{prop.name}</span>
                {prop.required || "?"}:{" "}
                {"raw" in prop.type ? prop.type.raw : prop.type.name}
                {prop.defaultValue && (
                  <>
                    {" = "}
                    <span className="text-white">
                      {prop.defaultValue.value}
                    </span>
                  </>
                )}
              </code>
            </dt>
            <dd
              className="ml-4 [&_code]:text-sky-300"
              dangerouslySetInnerHTML={{
                __html: prop.description
                  .replaceAll("\n\n", "<br/><br/>")
                  .replaceAll(/`([^`]+)`/g, "<code>$1</code>")
              }}
            ></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
