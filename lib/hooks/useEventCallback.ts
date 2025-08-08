import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// Forked from usehooks-ts
export function useEventCallback<Args, Return>(
  fn: (args: Args) => Return,
): (args: Args) => Return {
  const ref = useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((args: Args) => ref.current?.(args), [ref]) as (
    args: Args,
  ) => Return;
}
