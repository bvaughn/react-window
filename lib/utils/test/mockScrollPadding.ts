import { vi } from "vitest";

type ScrollPadding = Partial<
  Pick<
    CSSStyleDeclaration,
    | "scrollPaddingBottom"
    | "scrollPaddingLeft"
    | "scrollPaddingRight"
    | "scrollPaddingTop"
  >
>;

// jsdom doesn't support the scroll-padding properties, so tests specify computed values for elements
export function mockScrollPadding(
  getScrollPadding: (element: Element) => ScrollPadding | undefined
) {
  const getComputedStyle = window.getComputedStyle.bind(window);

  vi.spyOn(window, "getComputedStyle").mockImplementation(
    (element, pseudoElement) => {
      const style = getComputedStyle(element, pseudoElement);
      const padding = getScrollPadding(element);
      if (!padding) {
        return style;
      }

      return new Proxy(style, {
        get(target, property) {
          return property in padding
            ? padding[property as keyof ScrollPadding]
            : Reflect.get(target, property, target);
        }
      });
    }
  );
}
