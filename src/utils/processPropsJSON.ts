import type { ComponentMetadata, ComponentPropMetadata } from "../types";

export function processPropsJSON(json: ComponentMetadata) {
  const optionalProps: ComponentPropMetadata[] = [];
  const requiredProps: ComponentPropMetadata[] = [];

  Object.values(json.props).forEach((prop) => {
    if (prop.required) {
      requiredProps.push(prop);
    } else {
      optionalProps.push(prop);
    }
  });

  optionalProps.sort((a, b) => a.name.localeCompare(b.name));
  requiredProps.sort((a, b) => a.name.localeCompare(b.name));

  return { optionalProps, requiredProps };
}
