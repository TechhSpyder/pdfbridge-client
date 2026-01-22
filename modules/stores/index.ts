import { create } from "zustand";

type navState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SidebarState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};
export const useNavStore = create<navState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export const useSidebarStore = create<SidebarState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
