import type { ComponentPropMetadata } from "../../types";
import { Box } from "../Box";
import { ComponentProp } from "./ComponentProp";

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
    <Box direction="column">
      <div className="text-lg font-bold">{header}</div>
      <dl>
        {props.map((prop) => (
          <ComponentProp key={prop.name} prop={prop} />
        ))}
      </dl>
    </Box>
  );
}
