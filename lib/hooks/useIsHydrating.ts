import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * Returns true when rendering on the server or while hydrating server-rendered HTML.
 * Returns false for client-only renders and for any render after hydration has completed.
 */
export function useIsHydrating(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  );
}
