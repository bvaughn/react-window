import { useMemo } from "react";
import { type ComponentDoc, type PropItem } from "react-docgen-typescript";
import { processPropsJSON } from "../utils/processPropsJSON";
import { Block } from "./Block";

export function PropsBlocks({ json }: { json: ComponentDoc }) {
  const { optionalProps, requiredProps } = useMemo(
    () => processPropsJSON(json),
    [json],
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
  props,
}: {
  header: string;
  props: PropItem[];
}) {
  if (props.length === 0) {
    return null;
  }

  return (
    <Block>
      <div>{header}</div>
      <dl>
        {props.map((prop) => (
          <div className="text-xs" key={prop.name}>
            <dt className="mt-2">
              <code>
                {prop.name}
                {prop.required || "?"}:{" "}
                {"raw" in prop.type ? prop.type.raw : prop.type.name}
                {prop.defaultValue && ` = ${prop.defaultValue.value}`}
              </code>
            </dt>
            <dd
              className="ml-4 text-neutral-400"
              dangerouslySetInnerHTML={{
                __html: prop.description.replace("\n\n", "<br/><br/>"),
              }}
            ></dd>
          </div>
        ))}
      </dl>
    </Block>
  );
}
