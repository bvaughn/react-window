import { useRef } from "react";
import type { ListImperativeAPI } from "./types";

/**
 * Convenience hook to return a properly typed ref for the List component.
 */
export const useListRef = useRef as typeof useRef<ListImperativeAPI>;
