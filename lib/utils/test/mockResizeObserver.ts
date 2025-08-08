const dispatcher = new EventTarget();

let entrySize: DOMRectReadOnly = new DOMRect(0, 0, 0, 0);

export function updateMockResizeObserver(value: DOMRect): void {
  entrySize = value;

  dispatcher.dispatchEvent(new Event("change"));
}

export function mockResizeObserver() {
  window.ResizeObserver = class implements ResizeObserver {
    readonly #callback: ResizeObserverCallback;
    #disconnected: boolean = false;
    #elements: Set<HTMLElement> = new Set();

    constructor(callback: ResizeObserverCallback) {
      this.#callback = callback;

      dispatcher.addEventListener("change", this.#notify);
    }

    observe(element: HTMLElement) {
      if (this.#disconnected) {
        return;
      }

      this.#elements.add(element);
      this.#notify();
    }

    unobserve(element: HTMLElement) {
      this.#elements.delete(element);
    }

    disconnect() {
      this.#disconnected = true;

      dispatcher.removeEventListener("change", this.#notify);
    }

    #notify() {
      this.#callback(
        Array.from(this.#elements).map((element) => ({
          borderBoxSize: [],
          contentBoxSize: [],
          contentRect: entrySize,
          devicePixelContentBoxSize: [],
          target: element,
        })),
        this,
      );
    }
  };
}
