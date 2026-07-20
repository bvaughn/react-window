import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// Forked from useEventCallback (usehooks-ts)
export function useStableCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return;
export function useStableCallback<Args extends unknown[], Return>(
  fn: ((...args: Args) => Return) | undefined
): ((...args: Args) => Return) | undefined;
export function useStableCallback<Args extends unknown[], Return>(
  fn: ((...args: Args) => Return) | undefined
): ((...args: Args) => Return) | undefined {
  const ref = useRef<typeof fn>(() => {
    // This error ensures components don't render with previous/stale function
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as (
    ...args: Args
  ) => Return;
}
