import { create } from "zustand";

export const useAppStore = create((set) => ({
  isSidebarOpen: true,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setOnlineStatus: (isOnline) => set({ isOnline }),
}));
