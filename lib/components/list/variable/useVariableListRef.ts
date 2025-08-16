import { useRef } from "react";
import type { ListImperativeAPI } from "../types";

/**
 * Convenience hook to return a properly typed ref for the VariableList component.
 */
export const useVariableListRef = useRef as typeof useRef<ListImperativeAPI>;
