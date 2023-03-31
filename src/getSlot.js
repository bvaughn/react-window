import { ReactNode } from 'react';
export type SlotCallback = () => ReactNode;

export const getSlot = (value: SlotCallback | ReactNode): ReactNode =>
  typeof value === 'function' ? value() : value;
