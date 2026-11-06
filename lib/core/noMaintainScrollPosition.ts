import type { useMaintainScrollPosition } from "./useMaintainScrollPosition";

export type MaintainScrollPositionHook = typeof useMaintainScrollPosition;

const noop = () => {};

/**
 * Stand-in for useMaintainScrollPosition, for virtualizers that never keep items in place (e.g. Grid),
 * so that they don't include its code; it calls no hooks.
 *
 * ⚠️ A virtualizer must always use the same hook (this or useMaintainScrollPosition) for as long as it's mounted.
 */
export const noMaintainScrollPosition: MaintainScrollPositionHook = ({
  rawCachedBounds
}) => ({
  anchorItem: noop,
  cachedBounds: rawCachedBounds,
  correctionRenderCount: 0,
  deviation: 0,
  recordRenderedKeys: noop
});
