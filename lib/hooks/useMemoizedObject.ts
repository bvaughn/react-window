import { useMemo } from "react";

export function useMemoizedObject<Type extends object>(
  unstableObject: Type
): Type {
  return useMemo(() => {
    return unstableObject;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(unstableObject));
}
