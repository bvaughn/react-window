import { useRef } from "react";
import type { SimpleListImperativeAPI } from "..";

/**
 * Convenience hook to return a properly typed ref for the SimpleList component.
 */
export const useSimpleListRef =
  useRef as typeof useRef<SimpleListImperativeAPI>;
