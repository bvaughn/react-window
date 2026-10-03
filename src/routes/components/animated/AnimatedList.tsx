import { useLayoutEffect, useRef, useState } from "react";
import { AnimatedListRow } from "./AnimatedListRow";

// Animation timing (in milliseconds)
const PAUSE_DURATION = 500;
const SCROLL_DURATION = 2_000;
const CYCLE_DURATION = 2 * (PAUSE_DURATION + SCROLL_DURATION);

export function AnimatedList({ rowCount }: { rowCount: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [[visibleStartIndex, visibleStopIndex], setVisibleRange] = useState<
    [number, number]
  >([0, 1]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const list = listRef.current;
    const viewport = viewportRef.current;
    const thumb = thumbRef.current;
    const track = thumb?.parentElement;
    if (!container || !list || !viewport || !thumb || !track) {
      return;
    }

    const rows = Array.from(list.children) as HTMLElement[];

    let maxScrollTop = 0;
    let lastProgress = 0;

    // Sizes are measured (rather than hard-coded) because they depend on the root font size,
    // which can change when the window is resized
    const measure = () => {
      maxScrollTop = list.offsetHeight - viewport.offsetHeight;

      // The viewport stays put while the list scrolls beneath it
      container.style.height = `${list.offsetHeight + maxScrollTop}px`;
      viewport.style.top = `${maxScrollTop}px`;
    };

    const update = (progress: number) => {
      lastProgress = progress;

      const scrollTop = progress * maxScrollTop;

      list.style.transform = `translateY(${maxScrollTop - scrollTop}px)`;

      const thumbInset = (track.clientWidth - thumb.offsetWidth) / 2;
      const maxThumbTop =
        track.clientHeight - thumb.offsetHeight - 2 * thumbInset;
      thumb.style.top = `${thumbInset + progress * maxThumbTop}px`;

      // Rows that are visible within the viewport's border are "rendered"
      const viewportTop = scrollTop + viewport.clientTop;
      const viewportBottom = viewportTop + viewport.clientHeight;

      let startIndex = -1;
      let stopIndex = -1;
      rows.forEach((row, index) => {
        const rowTop = row.offsetTop;
        const rowBottom = rowTop + row.offsetHeight;
        if (rowBottom > viewportTop && rowTop < viewportBottom) {
          if (startIndex < 0) {
            startIndex = index;
          }
          stopIndex = index;
        }
      });

      setVisibleRange((prev) =>
        prev[0] === startIndex && prev[1] === stopIndex
          ? prev
          : [startIndex, stopIndex]
      );
    };

    const mediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let animationFrameId: number | undefined;

    const start = () => {
      const startTime = performance.now();
      const tick = (now: number) => {
        update(getProgress(now - startTime));
        animationFrameId = requestAnimationFrame(tick);
      };
      animationFrameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    };

    const onChange = () => {
      stop();
      update(0);
      if (!mediaQueryList.matches) {
        start();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      update(lastProgress);
    });
    resizeObserver.observe(list);
    resizeObserver.observe(viewport);

    measure();
    onChange();
    mediaQueryList.addEventListener("change", onChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      mediaQueryList.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="relative w-60" ref={containerRef}>
      <div
        className="absolute top-0 left-0 w-full flex flex-col gap-1 p-2 pr-6 will-change-transform"
        ref={listRef}
      >
        {new Array(rowCount).fill(true).map((_, index) => (
          <AnimatedListRow
            children={`row ${index + 1}`}
            key={index}
            rendered={index >= visibleStartIndex && index <= visibleStopIndex}
          />
        ))}
      </div>
      <div
        className="rounded rounded-md border border-2 border-white absolute left-0 h-19 w-full"
        ref={viewportRef}
      >
        <div className="absolute right-0 h-full w-4 bg-white/5">
          <div
            className="absolute right-1 top-1 h-3 w-2 rounded bg-white/50"
            ref={thumbRef}
          />
        </div>
      </div>
    </div>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Ping-pongs between 0 and 1, pausing at either end
function getProgress(time: number) {
  const t = time % CYCLE_DURATION;
  if (t < PAUSE_DURATION) {
    return 0;
  } else if (t < PAUSE_DURATION + SCROLL_DURATION) {
    return easeInOut((t - PAUSE_DURATION) / SCROLL_DURATION);
  } else if (t < 2 * PAUSE_DURATION + SCROLL_DURATION) {
    return 1;
  } else {
    return (
      1 -
      easeInOut((t - 2 * PAUSE_DURATION - SCROLL_DURATION) / SCROLL_DURATION)
    );
  }
}
