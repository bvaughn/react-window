import { isVerticallyOverScolled } from '../domHelpers';

describe('isVerticallyOverScolled', () => {
  const clientHeight = 500;
  const scrollHeight = 1000;

  it('returns overscrolled when scrollTop is less than 0', () => {
    const isOverScolled = isVerticallyOverScolled({
      scrollTop: -1,
      clientHeight,
      scrollHeight
    });
    expect(isOverScolled).toBe(true);
  });

  it('returns not overscrolled when scrollTop is equal to 0', () => {
    const isOverScolled = isVerticallyOverScolled({
      scrollTop: 0,
      clientHeight,
      scrollHeight
    });
    expect(isOverScolled).toBe(false);
  });

  it('returns not overscrolled when scrollTop is equal to scrollHeight minus clientHeight', () => {
    const isOverScolled = isVerticallyOverScolled({
      scrollTop: (scrollHeight - clientHeight),
      clientHeight,
      scrollHeight
    });
    expect(isOverScolled).toBe(false);
  });

  it('returns overscrolled when scrollTop is greater than scrollHeight minus clientHeight', () => {
    const isOverScolled = isVerticallyOverScolled({
      scrollTop: (scrollHeight - clientHeight) + 1,
      clientHeight,
      scrollHeight
    });
    expect(isOverScolled).toBe(true);
  });
});
