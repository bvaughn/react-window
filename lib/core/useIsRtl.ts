import { useLayoutEffect, useState, type HTMLAttributes } from "react";
import { isRtl } from "../utils/isRtl";

export function useIsRtl(
  element: HTMLElement | null,
  dir: HTMLAttributes<HTMLElement>["dir"]
) {
  const [value, setValue] = useState(dir === "rtl");

  useLayoutEffect(() => {
    if (dir) {
      setValue(dir === "rtl");
    } else if (element) {
      setValue(isRtl(element));
    }
  }, [dir, element]);

  return value;
}
