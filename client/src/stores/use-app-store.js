import { create } from "zustand";

export const useAppStore = create((set) => ({
  isSidebarOpen: true,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  isSyncing: false,
  pendingSyncCount: 0,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setOnlineStatus: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),
}));
