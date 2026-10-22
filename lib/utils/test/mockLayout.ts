import { onTestFinished, vi } from "vitest";

export type Layout = {
  clientHeight?: number;
  clientWidth?: number;
  height: number;
  left: number;
  scrollHeight?: number;
  scrollWidth?: number;
  top: number;
  width: number;
};

type GetLayout = (element: HTMLElement) => Layout | undefined;

// jsdom doesn't implement layout; this simulates element geometry (in client coordinates) for tests
export function mockLayout(getLayout: GetLayout) {
  const prototype = HTMLElement.prototype;

  vi.spyOn(prototype, "getBoundingClientRect").mockImplementation(
    function getBoundingClientRect(this: HTMLElement) {
      const layout = getLayout(this);
      return layout
        ? new DOMRect(layout.left, layout.top, layout.width, layout.height)
        : new DOMRect(0, 0, 0, 0);
    }
  );

  const properties = {
    clientHeight: (layout: Layout) => layout.clientHeight ?? layout.height,
    clientWidth: (layout: Layout) => layout.clientWidth ?? layout.width,
    scrollHeight: (layout: Layout) =>
      layout.scrollHeight ?? layout.clientHeight ?? layout.height,
    scrollWidth: (layout: Layout) =>
      layout.scrollWidth ?? layout.clientWidth ?? layout.width
  } as const;

  for (const [name, getValue] of Object.entries(properties)) {
    Object.defineProperty(prototype, name, {
      configurable: true,
      get(this: HTMLElement) {
        const layout = getLayout(this);
        return layout ? getValue(layout) : 0;
      }
    });
  }

  onTestFinished(() => {
    for (const name of Object.keys(properties)) {
      // @ts-expect-error Remove the override so Element.prototype's getter is used again
      delete prototype[name];
    }
  });
}

// Simulates scrolling the window (jsdom doesn't implement window.scrollTo)
export function mockWindowScroll({
  height,
  width
}: {
  height: number;
  width: number;
}) {
  const position = { x: 0, y: 0 };

  // Restore jsdom's own definitions (rather than replacing them) after the test
  const originalDescriptors = {
    scrollX: Object.getOwnPropertyDescriptor(window, "scrollX"),
    scrollY: Object.getOwnPropertyDescriptor(window, "scrollY")
  };

  Object.defineProperty(window, "scrollX", {
    configurable: true,
    get: () => position.x
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    get: () => position.y
  });

  const scrollTo = vi
    .spyOn(window, "scrollTo")
    .mockImplementation((options?: ScrollToOptions | number) => {
      if (typeof options === "object") {
        if (options.left !== undefined) {
          position.x = options.left;
        }
        if (options.top !== undefined) {
          position.y = options.top;
        }
      }

      window.dispatchEvent(new Event("scroll"));
    });

  onTestFinished(() => {
    for (const [name, descriptor] of Object.entries(originalDescriptors)) {
      if (descriptor) {
        Object.defineProperty(window, name, descriptor);
      } else {
        // @ts-expect-error Remove the override (jsdom defines the property on a prototype)
        delete window[name];
      }
    }
  });

  return {
    position,
    scrollTo,
    viewport: { height, width }
  };
}
