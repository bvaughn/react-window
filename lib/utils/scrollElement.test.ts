import { describe, expect, test } from "vitest";
import { getScrollPadding, isSelfScrolling } from "./scrollElement";
import { mockLayout } from "./test/mockLayout";
import { mockScrollPadding } from "./test/mockScrollPadding";

describe("isSelfScrolling", () => {
  function setup({
    overflow,
    scrollHeight
  }: {
    overflow: string;
    scrollHeight: number;
  }) {
    const element = document.createElement("div");
    // jsdom doesn't expand the overflow shorthand
    element.style.overflowY = overflow;
    document.body.appendChild(element);

    mockLayout((target) =>
      target === element
        ? { height: 100, left: 0, scrollHeight, top: 0, width: 100 }
        : undefined
    );

    return element;
  }

  test("should be true if content overflows a scrolling element", () => {
    const element = setup({ overflow: "auto", scrollHeight: 200 });
    expect(isSelfScrolling(element, "vertical")).toBe(true);
    element.remove();
  });

  test("should allow for rounding of fractional sizes", () => {
    const element = setup({ overflow: "auto", scrollHeight: 101 });
    expect(isSelfScrolling(element, "vertical")).toBe(false);
    element.remove();
  });

  test("should be false for elements that don't scroll", () => {
    const element = setup({ overflow: "visible", scrollHeight: 200 });
    expect(isSelfScrolling(element, "vertical")).toBe(false);
    element.remove();
  });
});

describe("getScrollPadding", () => {
  test("should read vertical scroll padding", () => {
    const element = document.createElement("div");
    mockScrollPadding(() => ({
      scrollPaddingBottom: "10%",
      scrollPaddingTop: "30px"
    }));

    expect(
      getScrollPadding({
        direction: "vertical",
        isRtl: false,
        scrollTarget: element,
        viewportSize: 200
      })
    ).toEqual({ end: 20, start: 30 });
  });

  test("should treat other values as 0", () => {
    const element = document.createElement("div");
    mockScrollPadding(() => ({
      scrollPaddingBottom: "auto",
      scrollPaddingTop: "calc(10px + 1em)"
    }));

    expect(
      getScrollPadding({
        direction: "vertical",
        isRtl: false,
        scrollTarget: element,
        viewportSize: 200
      })
    ).toEqual({ end: 0, start: 0 });
  });

  test("should start from the right for RTL content", () => {
    const element = document.createElement("div");
    mockScrollPadding(() => ({
      scrollPaddingLeft: "5px",
      scrollPaddingRight: "15px"
    }));

    const options = {
      direction: "horizontal",
      scrollTarget: element,
      viewportSize: 200
    } as const;
    expect(getScrollPadding({ ...options, isRtl: false })).toEqual({
      end: 15,
      start: 5
    });
    expect(getScrollPadding({ ...options, isRtl: true })).toEqual({
      end: 5,
      start: 15
    });
  });

  test("should read the window's scroll padding from the root element", () => {
    mockScrollPadding((element) =>
      element === document.documentElement
        ? { scrollPaddingTop: "50px" }
        : undefined
    );

    expect(
      getScrollPadding({
        direction: "vertical",
        isRtl: false,
        scrollTarget: window,
        viewportSize: 200
      }).start
    ).toBe(50);
  });
});
