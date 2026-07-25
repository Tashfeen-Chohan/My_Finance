import { create } from "zustand";

interface AppState {
  isSidebarOpen: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  setPendingSyncCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  isSyncing: false,
  pendingSyncCount: 0,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  setOnlineStatus: (isOnline: boolean) => set({ isOnline }),
  setSyncing: (isSyncing: boolean) => set({ isSyncing }),
  setPendingSyncCount: (count: number) => set({ pendingSyncCount: count }),
}));
