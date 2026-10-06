import { useLayoutEffect, useRef, useState } from "react";
import { AnimatedListColumn } from "./AnimatedListColumn";

// Animation timing (in milliseconds)
const PAUSE_DURATION = 500;
const SCROLL_DURATION = 2_000;
const CYCLE_DURATION = 2 * (PAUSE_DURATION + SCROLL_DURATION);

export function AnimatedList({ columnCount }: { columnCount: number }) {
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

    const columns = Array.from(list.children) as HTMLElement[];

    let maxScrollLeft = 0;
    let lastProgress = 0;

    // Sizes are measured (rather than hard-coded) because they depend on the root font size,
    // which can change when the window is resized
    const measure = () => {
      maxScrollLeft = list.offsetWidth - viewport.offsetWidth;

      // The viewport stays put while the list scrolls beneath it
      container.style.height = `${list.offsetHeight}px`;
      container.style.width = `${list.offsetWidth + maxScrollLeft}px`;
      viewport.style.left = `${maxScrollLeft}px`;
    };

    const update = (progress: number) => {
      lastProgress = progress;

      const scrollLeft = progress * maxScrollLeft;

      list.style.transform = `translateX(${maxScrollLeft - scrollLeft}px)`;

      const thumbInset = (track.clientHeight - thumb.offsetHeight) / 2;
      const maxThumbLeft =
        track.clientWidth - thumb.offsetWidth - 2 * thumbInset;
      thumb.style.left = `${thumbInset + progress * maxThumbLeft}px`;

      // Columns that are visible within the viewport's border are "rendered"
      const viewportLeft = scrollLeft + viewport.clientLeft;
      const viewportRight = viewportLeft + viewport.clientWidth;

      let startIndex = -1;
      let stopIndex = -1;
      columns.forEach((column, index) => {
        const columnLeft = column.offsetLeft;
        const columnRight = columnLeft + column.offsetWidth;
        if (columnRight > viewportLeft && columnLeft < viewportRight) {
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
    <div className="relative" ref={containerRef}>
      <div
        className="absolute top-0 left-0 flex flex-row gap-1 p-2 pb-6 will-change-transform"
        ref={listRef}
      >
        {new Array(columnCount).fill(true).map((_, index) => (
          <AnimatedListColumn
            children={`${index + 1}`}
            key={index}
            rendered={index >= visibleStartIndex && index <= visibleStopIndex}
          />
        ))}
      </div>
      <div
        className="rounded rounded-md border border-2 border-white absolute top-0 h-full w-22 sm:w-42"
        ref={viewportRef}
      >
        <div className="absolute bottom-0 w-full h-4 bg-white/5">
          <div
            className="absolute bottom-1 left-1 w-3 h-2 rounded bg-white/50"
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
