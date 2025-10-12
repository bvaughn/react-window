import { getContrastColor } from "./colors/getContrastColor";
import { stringToColor } from "./colors/stringToColor";

export function debug(namespace: string, ...args: unknown[]) {
  const backgroundColor = stringToColor(namespace);
  const color = getContrastColor(backgroundColor);

  console.log(
    `%c ${namespace} `,
    `background-color: ${backgroundColor}; color: ${color};`,
    ...args
  );
}
