import { create } from "zustand";

export const useNavStore = create<{
  visible: boolean;

  hide: () => void;
  show: () => void;
  toggle: () => void;
}>((set) => ({
  visible: false,

  hide: () => set({ visible: false }),
  show: () => set({ visible: true }),
  toggle: () => set((state) => ({ visible: !state.visible }))
}));
