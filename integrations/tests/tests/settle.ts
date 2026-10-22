import type { Page } from "@playwright/test";

/**
 * Waits until the page stops changing: the DOM (e.g. rendered rows and their positions) and scroll positions
 * stay the same for several consecutive frames.
 *
 * Waiting for a fixed number of frames is slow in browsers that run frames at 60fps (e.g. WebKit),
 * and isn't necessary once rows have rendered and been measured.
 */
export async function settle(
  page: Page,
  {
    maxFrames = 60,
    minFrames = 3,
    stableFrames = 5
  }: { maxFrames?: number; minFrames?: number; stableFrames?: number } = {}
) {
  await page.evaluate(
    async ({ maxFrames, minFrames, stableFrames }) => {
      const getSnapshot = () => {
        const scrollPositions = Array.from(
          document.querySelectorAll(
            '[data-testid="scroller"], [role="grid"], [role="list"]'
          )
        ).map((element) => `${element.scrollLeft},${element.scrollTop}`);

        return [
          window.scrollX,
          window.scrollY,
          ...scrollPositions,
          document.body.innerHTML
        ].join("|");
      };

      // WebKit on Linux (in CI) sometimes stops running animation frames;
      // don't wait for more than a frame's worth of time (at a low frame rate)
      const nextFrame = () =>
        new Promise<void>((resolve) => {
          const done = () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
            resolve();
          };
          const animationFrameId = requestAnimationFrame(done);
          const timeoutId = setTimeout(done, 50);
        });

      let snapshot = getSnapshot();
      let unchangedFrames = 0;
      for (let frame = 0; frame < maxFrames; frame++) {
        await nextFrame();

        const nextSnapshot = getSnapshot();
        unchangedFrames = nextSnapshot === snapshot ? unchangedFrames + 1 : 0;
        snapshot = nextSnapshot;

        if (frame + 1 >= minFrames && unchangedFrames >= stableFrames) {
          return;
        }
      }
    },
    { maxFrames, minFrames, stableFrames }
  );
}
