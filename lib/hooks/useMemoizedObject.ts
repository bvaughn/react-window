import { useState } from "react";
import { shallowCompare } from "../utils/shallowCompare";

export function useMemoizedObject<Type extends object>(
  unstableObject: Type
): Type {
  const [memoizedObject, setMemoizedObject] = useState(unstableObject);

  if (!shallowCompare(memoizedObject, unstableObject)) {
    setMemoizedObject(unstableObject);

    return unstableObject;
  }

  return memoizedObject;
}
