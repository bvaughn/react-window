// @flow

let size: number = -1;

// This utility copied from "dom-helpers" package.
export function getScrollbarSize(recalculate?: boolean = false): number {
  if (size === -1 || recalculate) {
    const div = document.createElement('div');
    const style = div.style;
    style.width = '50px';
    style.height = '50px';
    style.overflow = 'scroll';

    ((document.body: any): HTMLBodyElement).appendChild(div);

    size = div.offsetWidth - div.clientWidth;

    ((document.body: any): HTMLBodyElement).removeChild(div);
  }

  return size;
}

// Determines whether or not we have scrolled outside of the
// container boundaries. This occurs frequently on iOS
// with the rubber band overscrolling feature. This current
// implementation is focused specifically on vertical scrolling
// for Lists. A similar strategy for horizontal scrolling may
// need extra consideration due to rtl vs ltr concerns.
//
// MDN determine if an element has been totally scrolled:
// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
type Props = {
  clientHeight: number,
  scrollHeight: number,
  scrollTop: number,
};

export function isVerticallyOverScrolled({
  clientHeight,
  scrollHeight,
  scrollTop,
}: Props): boolean {
  const isOverScrolled =
    scrollTop < 0 || scrollTop > scrollHeight - clientHeight;
  return isOverScrolled;
}
