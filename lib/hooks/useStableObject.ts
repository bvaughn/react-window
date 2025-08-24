import { useMemo } from "react";

export function useStableObject<Type extends object>(
  unstableObject: Type
): Type {
  return useMemo(() => {
    return unstableObject;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(unstableObject));
}
