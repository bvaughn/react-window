import { useRef } from "react";
import type { GridImperativeAPI } from "./types";

/**
 * Convenience hook to return a properly typed ref for the Grid component.
 */
export const useGridRef = useRef as typeof useRef<GridImperativeAPI>;
