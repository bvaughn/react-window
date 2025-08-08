import { type ComponentDoc, type PropItem } from "react-docgen-typescript";

export function processPropsJSON(json: ComponentDoc) {
  const optionalProps: PropItem[] = [];
  const requiredProps: PropItem[] = [];

  Object.values(json.props).forEach((prop) => {
    if (prop.required) {
      requiredProps.push(prop);
    } else {
      optionalProps.push(prop);
    }
  });

  return { optionalProps, requiredProps };
}
