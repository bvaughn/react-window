import { hasNativePerformanceNow } from "./hasNativePerformanceNow";

export const now = hasNativePerformanceNow
  ? () => performance.now()
  : () => Date.now();
