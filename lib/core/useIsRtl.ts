import { useState, type HTMLAttributes } from "react";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { isRtl } from "../utils/isRtl";

export function useIsRtl(
  element: HTMLElement | null,
  dir: HTMLAttributes<HTMLElement>["dir"]
) {
  const [value, setValue] = useState(dir === "rtl");

  useIsomorphicLayoutEffect(() => {
    if (dir) {
      setValue(dir === "rtl");
    } else if (element) {
      setValue(isRtl(element));
    }
  }, [dir, element]);

  return value;
}
