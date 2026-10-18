import { useEffect } from "react";
import { getOwnerWindow } from "../utils/getOwnerWindow";
import { useStableCallback } from "./useStableCallback";

/**
 * Calls the callback once the initial ResizeObserver notifications for elements rendered within the specified element
 * have been delivered (or would have been, if ResizeObserver is unsupported).
 *
 * ResizeObserver notifications are delivered between layout and paint, so waiting two animation frames ensures
 * that a frame has been rendered since the elements were first observed.
 */
export function useAfterResizeObserverNotifications({
  callback,
  element,
  enabled = true
}: {
  callback: () => void;
  element: HTMLElement | null;
  enabled?: boolean;
}) {
  const stableCallback = useStableCallback(callback);

  useEffect(() => {
    if (!enabled || !element) {
      return;
    }

    const ownerWindow = getOwnerWindow(element);
    let id = ownerWindow.requestAnimationFrame(() => {
      id = ownerWindow.requestAnimationFrame(stableCallback);
    });

    return () => {
      ownerWindow.cancelAnimationFrame(id);
    };
  }, [element, enabled, stableCallback]);
}
