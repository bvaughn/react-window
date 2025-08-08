export const hasNativePerformanceNow =
  typeof performance === "object" && typeof performance.now === "function";
