import { describe, expect, test, vi } from "vitest";
import { createElementInOtherWindow } from "./test/createElementInOtherWindow";
import { getScrollbarSize } from "./getScrollbarSize";

describe("getScrollbarSize", () => {
  test("should probe and cache each document separately", () => {
    const { otherWindow } = createElementInOtherWindow();

    const createElement = vi.spyOn(document, "createElement");
    const createOtherElement = vi.spyOn(otherWindow.document, "createElement");

    try {
      getScrollbarSize(true);
      createElement.mockClear();

      // Main document is cached; other document is probed (only once)
      getScrollbarSize();
      getScrollbarSize(false, otherWindow.document);
      getScrollbarSize(false, otherWindow.document);
      expect(createElement).not.toHaveBeenCalled();
      expect(createOtherElement).toHaveBeenCalled();

      createOtherElement.mockClear();
      getScrollbarSize(false, otherWindow.document);
      expect(createOtherElement).not.toHaveBeenCalled();
    } finally {
      createElement.mockRestore();
    }
  });
});
