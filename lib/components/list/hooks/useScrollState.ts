import { useState, type UIEvent } from "react";
import type { ScrollState } from "../types";

export function useScrollState() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    prevScrollTop: 0,
    scrollTop: 0,
  });

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;

    // If scroll event was triggered by the imperative API, ignore it
    if (scrollState.scrollTop === scrollTop) {
      return;
    }

    // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
    const nextScrollTop = Math.max(
      0,
      Math.min(scrollTop, scrollHeight - clientHeight),
    );

    setScrollState({
      prevScrollTop: scrollTop,
      scrollTop: nextScrollTop,
    });
  };

  return {
    onScroll,
    scrollState,
  };
}
