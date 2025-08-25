import { useState } from "react";
import type { GridImperativeAPI } from "./types";

/**
 * Convenience hook to return a properly typed ref callback for the Grid component.
 *
 * Use this hook when you need to share the ref with another component or hook.
 */
export const useGridCallbackRef =
  useState as typeof useState<GridImperativeAPI | null>;
