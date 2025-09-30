import type { DynamicRowHeight } from "./types";

export function isDynamicRowHeight(value: unknown): value is DynamicRowHeight {
  return (
    value != null &&
    typeof value === "object" &&
    "getAverageRowHeight" in value &&
    typeof value.getAverageRowHeight === "function"
  );
}
