import EventEmitter from "node:events";

type GetDOMRect = (element: HTMLElement) => DOMRectReadOnly | undefined | void;

const emitter = new EventEmitter();
emitter.setMaxListeners(100);

const elementToDOMRect = new Map<HTMLElement, DOMRect>();

let defaultDomRect: DOMRectReadOnly = new DOMRect(0, 0, 0, 0);
let disabled: boolean = false;
let getDOMRect: GetDOMRect | undefined = undefined;

export function disableResizeObserverForCurrentTest() {
  disabled = true;
}

export function setDefaultElementSize({
  height,
  width
}: {
  height: number;
  width: number;
}) {
  defaultDomRect = new DOMRect(0, 0, width, height);

  emitter.emit("change");
}

export function setElementSizeFunction(value: GetDOMRect) {
  getDOMRect = value;

  emitter.emit("change");
}

export function setElementSize({
  element,
  height,
  width
}: {
  element: HTMLElement;
  height: number;
  width: number;
}) {
  elementToDOMRect.set(element, new DOMRect(0, 0, width, height));

  emitter.emit("change", element);
}

export function simulateUnsupportedEnvironmentForTest() {
  // @ts-expect-error Simulate API being unsupported
  window.ResizeObserver = null;
}

export function mockResizeObserver() {
  disabled = false;

  const originalResizeObserver = window.ResizeObserver;

  window.ResizeObserver = MockResizeObserver;

  return function unmockResizeObserver() {
    window.ResizeObserver = originalResizeObserver;

    defaultDomRect = new DOMRect(0, 0, 0, 0);
    disabled = false;
    getDOMRect = undefined;

    elementToDOMRect.clear();
  };
}

class MockResizeObserver implements ResizeObserver {
  readonly #callback: ResizeObserverCallback;
  #disconnected: boolean = false;
  #elements: Set<HTMLElement> = new Set();

  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback;

    emitter.addListener("change", this.#onChange);
  }

  observe(element: HTMLElement) {
    if (this.#disconnected) {
      return;
    }

    this.#elements.add(element);
    this.#notify([element]);
  }

  unobserve(element: HTMLElement) {
    this.#elements.delete(element);
  }

  disconnect() {
    this.#disconnected = true;
    this.#elements.clear();

    emitter.removeListener("change", this.#onChange);
  }

  #notify(elements: HTMLElement[]) {
    if (disabled) {
      return;
    }

    const entries = elements.map((element) => {
      const computedStyle = window.getComputedStyle(element);
      const writingMode = computedStyle.writingMode;

      let contentRect: DOMRectReadOnly =
        elementToDOMRect.get(element) ?? defaultDomRect;

      if (getDOMRect) {
        const contentRectOverride = getDOMRect(element);
        if (contentRectOverride) {
          contentRect = contentRectOverride;
        }
      }

      let blockSize = 0;
      let inlineSize = 0;
      if (writingMode.includes("vertical")) {
        blockSize = contentRect.width;
        inlineSize = contentRect.height;
      } else {
        blockSize = contentRect.height;
        inlineSize = contentRect.width;
      }

      return {
        borderBoxSize: [
          {
            blockSize,
            inlineSize
          }
        ],
        contentBoxSize: [],
        contentRect,
        devicePixelContentBoxSize: [],
        target: element
      };
    });

    this.#callback(entries, this);
  }

  #onChange = (target?: HTMLElement) => {
    if (target) {
      if (this.#elements.has(target)) {
        this.#notify([target]);
      }
    } else {
      this.#notify(Array.from(this.#elements));
    }
  };
}
