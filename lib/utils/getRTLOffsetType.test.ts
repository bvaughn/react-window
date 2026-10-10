import { describe, expect, test, vi } from "vitest";
import { createElementInOtherWindow } from "./test/createElementInOtherWindow";
import { getRTLOffsetType } from "./getRTLOffsetType";

describe("getRTLOffsetType", () => {
  test("should probe and cache each document separately", () => {
    const { otherWindow } = createElementInOtherWindow();

    const createElement = vi.spyOn(document, "createElement");
    const createOtherElement = vi.spyOn(otherWindow.document, "createElement");

    try {
      getRTLOffsetType(true);
      createElement.mockClear();

      // Main document is cached; other document is probed (only once)
      getRTLOffsetType();
      getRTLOffsetType(false, otherWindow.document);
      getRTLOffsetType(false, otherWindow.document);
      expect(createElement).not.toHaveBeenCalled();
      expect(createOtherElement).toHaveBeenCalled();

      createOtherElement.mockClear();
      getRTLOffsetType(false, otherWindow.document);
      expect(createOtherElement).not.toHaveBeenCalled();
    } finally {
      createElement.mockRestore();
    }
  });
});
