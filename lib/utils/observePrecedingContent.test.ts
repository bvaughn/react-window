import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { observePrecedingContent } from "./observePrecedingContent";
import { setElementSize } from "./test/mockResizeObserver";

// Resolves once pending MutationObserver callbacks have run
const flushMutations = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("observePrecedingContent", () => {
  let container: HTMLElement;

  beforeEach(() => {
    // <container>
    //   <before-ancestor />
    //   <ancestor>
    //     <before-element />
    //     <element><child /></element>
    //     <after-element />
    //   </ancestor>
    //   <after-ancestor />
    // </container>
    container = document.createElement("div");
    container.innerHTML = `
      <div id="before-container"></div>
      <div id="container-root">
        <div id="before-ancestor"></div>
        <div id="ancestor">
          <div id="before-element"></div>
          <div id="element"><div id="child"></div></div>
          <div id="after-element"></div>
        </div>
        <div id="after-ancestor"></div>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function get(id: string) {
    const element = document.getElementById(id);
    expect(element).not.toBeNull();
    return element!;
  }

  function resize(id: string) {
    setElementSize({ element: get(id), height: 123, width: 456 });
  }

  function setup() {
    const onChange = vi.fn();
    const stop = observePrecedingContent({
      container: get("container-root"),
      element: get("element"),
      onChange
    });

    // ResizeObserver notifies once when elements are first observed
    onChange.mockClear();

    return { onChange, stop };
  }

  test("should notify when content preceding the element or its ancestors resizes", () => {
    const { onChange } = setup();

    resize("before-element");
    expect(onChange).toHaveBeenCalledTimes(1);

    resize("before-ancestor");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test("should not observe the element, its children, following content, or content outside of the container", () => {
    const { onChange } = setup();

    resize("element");
    resize("child");
    resize("after-element");
    resize("after-ancestor");
    resize("before-container");

    expect(onChange).not.toHaveBeenCalled();
  });

  test("should notify when content is inserted or removed before the element, and observe inserted content", async () => {
    const { onChange } = setup();

    const inserted = document.createElement("div");
    inserted.id = "inserted";
    get("container-root").insertBefore(inserted, get("before-ancestor"));
    await flushMutations();
    expect(onChange).toHaveBeenCalled();

    onChange.mockClear();
    resize("inserted");
    expect(onChange).toHaveBeenCalledTimes(1);

    onChange.mockClear();
    get("before-element").remove();
    await flushMutations();
    expect(onChange).toHaveBeenCalled();
  });

  test("should ignore content inserted or removed after the element", async () => {
    const { onChange } = setup();

    // e.g. a portal (tooltip or modal) appended to the end of the <body>
    const appended = document.createElement("div");
    get("container-root").appendChild(appended);
    await flushMutations();
    expect(onChange).not.toHaveBeenCalled();

    appended.remove();
    get("after-element").remove();
    await flushMutations();
    expect(onChange).not.toHaveBeenCalled();
  });

  test("should notify when content is removed directly before the element", async () => {
    const { onChange } = setup();

    get("before-element").remove();
    await flushMutations();
    expect(onChange).toHaveBeenCalled();
  });

  test.each(["element", "text", "comment"] as const)(
    "should notify when an adjacent preceding %s node is removed without whitespace",
    async (kind) => {
      const element = get("element");
      const before =
        kind === "element"
          ? document.createElement("div")
          : kind === "text"
            ? document.createTextNode("preceding content")
            : document.createComment("preceding content");
      element.parentElement!.replaceChildren(before, element);
      const { onChange } = setup();

      expect(before.nextSibling).toBe(element);
      before.parentNode!.removeChild(before);
      await flushMutations();

      expect(onChange).toHaveBeenCalled();
    }
  );

  test("should notify and re-observe when the element is moved before preceding content", async () => {
    const { onChange } = setup();

    // e.g. a keyed reorder that moves the element ahead of its siblings
    const element = get("element");
    element.parentElement!.insertBefore(element, get("before-element"));
    await flushMutations();
    expect(onChange).toHaveBeenCalled();

    // Content that no longer precedes the element should no longer be observed
    onChange.mockClear();
    resize("before-element");
    expect(onChange).not.toHaveBeenCalled();
  });

  test("should stop observing", async () => {
    const { onChange, stop } = setup();

    stop();

    resize("before-element");
    get("container-root").prepend(document.createElement("div"));
    await flushMutations();

    expect(onChange).not.toHaveBeenCalled();
  });
});
