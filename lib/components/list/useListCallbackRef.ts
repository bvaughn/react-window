import { useState } from "react";
import type { ListImperativeAPI } from "./types";

/**
 * Convenience hook to return a properly typed ref callback for the List component.
 *
 * Use this hook when you need to share the ref with another component or hook.
 */
export const useListCallbackRef =
  useState as typeof useState<ListImperativeAPI | null>;
