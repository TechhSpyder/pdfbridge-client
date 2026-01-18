import { create } from "zustand";

type navState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useNavStore = create<navState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
