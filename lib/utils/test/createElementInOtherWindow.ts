import { onTestFinished, vi } from "vitest";

// Simulates an element rendered into another window (e.g. a popup rendered into via a portal)
// with its own ResizeObserver, so tests can verify the element's window is used instead of the global one.
export function createElementInOtherWindow() {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  // Remove the iframe even if the test fails, so it doesn't leak into later tests
  onTestFinished(() => {
    iframe.remove();
  });

  const otherWindow = iframe.contentWindow!;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  // @ts-expect-error Minimal ResizeObserver for the other window
  otherWindow.ResizeObserver = class {
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  };

  const element = otherWindow.document.createElement("div");
  otherWindow.document.body.appendChild(element);

  return {
    disconnect,
    element,
    observe,
    otherWindow,
    unobserve
  };
}
