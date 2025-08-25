import EventEmitter from "node:events";

const emitter = new EventEmitter();
emitter.setMaxListeners(25);

let disabled: boolean = false;
let entrySize: DOMRectReadOnly = new DOMRect(0, 0, 0, 0);

export function disableForCurrentTest() {
  disabled = true;
}

export function simulateUnsupportedEnvironmentForTest() {
  // @ts-expect-error Simulate API being unsupported
  window.ResizeObserver = null;
}

export function updateMockResizeObserver({
  height,
  target,
  width
}: {
  height?: number;
  target?: HTMLElement;
  width?: number;
}): void {
  entrySize = new DOMRect(
    0,
    0,
    width ?? entrySize.width,
    height ?? entrySize.height
  );

  emitter.emit("change", target);
}

export function mockResizeObserver() {
  disabled = false;

  const originalResizeObserver = window.ResizeObserver;

  window.ResizeObserver = class implements ResizeObserver {
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
      this.#notify(element);
    }

    unobserve(element: HTMLElement) {
      this.#elements.delete(element);
    }

    disconnect() {
      this.#disconnected = true;
      this.#elements.clear();

      emitter.removeListener("change", this.#onChange);
    }

    #notify(target: HTMLElement) {
      if (disabled) {
        return;
      }

      this.#callback(
        [
          {
            borderBoxSize: [],
            contentBoxSize: [],
            contentRect: entrySize,
            devicePixelContentBoxSize: [],
            target
          }
        ],
        this
      );
    }

    #onChange = (target?: HTMLElement) => {
      if (target) {
        this.#notify(target);
      } else {
        this.#elements.forEach((element) => this.#notify(element));
      }
    };
  };

  return function unmockResizeObserver() {
    window.ResizeObserver = originalResizeObserver;
  };
}
