import type { Ref, RefCallback } from "react";

export function composeRefs<Type>(
  ...refs: Array<Ref<Type> | undefined>
): RefCallback<Type> {
  return (value: Type) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null && typeof ref === "object") {
        ref.current = value;
      }
    });
  };
}
