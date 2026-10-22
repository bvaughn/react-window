import { describe, expect, test } from "vitest";
import {
  DATA_ATTRIBUTE_INDEX,
  DATA_ATTRIBUTE_LIST_INDEX,
  getItemIndex
} from "./itemIndex";

describe("getItemIndex", () => {
  function createElement(attributes: Record<string, string>) {
    const element = document.createElement("div");
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    return element;
  }

  test("should read the index set by List", () => {
    expect(
      getItemIndex(createElement({ [DATA_ATTRIBUTE_LIST_INDEX]: "5" }))
    ).toBe(5);
  });

  test("should read the data-index attribute", () => {
    expect(getItemIndex(createElement({ [DATA_ATTRIBUTE_INDEX]: "0" }))).toBe(
      0
    );
  });

  test("should prefer the index set by List", () => {
    expect(
      getItemIndex(
        createElement({
          [DATA_ATTRIBUTE_INDEX]: "row-1",
          [DATA_ATTRIBUTE_LIST_INDEX]: "1"
        })
      )
    ).toBe(1);
  });

  test.each(["", "row-5", "5px", "-1", "1.5", "NaN", "Infinity"])(
    "should ignore invalid index %j",
    (value) => {
      expect(
        getItemIndex(createElement({ [DATA_ATTRIBUTE_INDEX]: value }))
      ).toBeUndefined();
    }
  );

  test("should return undefined without an index", () => {
    expect(getItemIndex(createElement({}))).toBeUndefined();
  });
});
