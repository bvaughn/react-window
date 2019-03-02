// @flow

let size: number = -1;

// This utility copied from "dom-helpers" package.
export function getScrollbarSize(recalculate?: boolean = false): number {
  if (size === -1 || recalculate) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflow = 'scroll';

    ((document.body: any): HTMLBodyElement).appendChild(div);

    size = div.offsetWidth - div.clientWidth;

    ((document.body: any): HTMLBodyElement).removeChild(div);
  }

  return size;
}
