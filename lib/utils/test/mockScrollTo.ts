import { vi } from "vitest";

export function mockScrollTo() {
  const originalScrollTo = HTMLElement.prototype.scrollTo;

  // @ts-expect-error Support subset of the API for testing
  HTMLElement.prototype.scrollTo = function scrollTo({
    left,
    top
  }: ScrollToOptions) {
    if (left !== undefined) {
      this.scrollLeft = left;
    }
    if (top !== undefined) {
      this.scrollTop = top;
    }

    const event = new Event("scroll", {
      bubbles: true,
      cancelable: true,
      composed: false
    });

    this.dispatchEvent(event);
  };

  // @ts-expect-error Support subset of the API for testing
  HTMLElement.prototype.scrollTo = vi.fn(HTMLElement.prototype.scrollTo);

  return function unmockScrollTo() {
    HTMLElement.prototype.scrollTo = originalScrollTo;
  };
}
