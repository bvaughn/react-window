import { useRef } from "react";
import type { SimpleListImperativeAPI } from "..";

/**
 * Convenience hook to return a properly typed ref for the SimpleList component.
 */
export function useSimpleListRef() {
  return useRef<SimpleListImperativeAPI>(null);
}
