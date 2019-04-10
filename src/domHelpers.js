// @flow

import { detectScrollType } from 'normalize-scroll-left';

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

type NormalizeScrollLeftProps = {
  direction: 'ltr' | 'rtl',
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
};

// According to the spec, scrollLeft should be negative for RTL aligned elements.
// Chrome and Edge do not seem to adhere; Chromes scrollLeft values are positive (measured relative to the left), Edges are reversed
// See https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
export function normalizeScrollLeft(props: NormalizeScrollLeftProps): number {
  if (props.direction === 'ltr') {
    return props.scrollLeft;
  }

  switch (detectScrollType()) {
    case 'negative':
      return -props.scrollLeft;
      break;
    case 'reverse':
      return props.scrollLeft;
      break;
    default:
      return props.scrollWidth - props.clientWidth - props.scrollLeft;
      break;
  }
}
