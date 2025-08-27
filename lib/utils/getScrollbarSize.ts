let size: number = -1;

export function getScrollbarSize(recalculate: boolean = false): number {
  if (size === -1 || recalculate) {
    const div = document.createElement("div");
    const style = div.style;
    style.width = "50px";
    style.height = "50px";
    style.overflow = "scroll";

    document.body.appendChild(div);

    size = div.offsetWidth - div.clientWidth;

    document.body.removeChild(div);
  }

  return size;
}

export function setScrollbarSizeForTests(value: number) {
  size = value;
}
