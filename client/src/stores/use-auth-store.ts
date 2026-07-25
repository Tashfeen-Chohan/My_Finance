import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { apiClient } from "@/services/api-client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  loginWithGoogleCredential: (credential: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMockUser: (mockData?: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  checkAuthSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      loginWithGoogleCredential: async (credential) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<User>("/auth/google", { credential });
          if (res.success && res.data) {
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return { success: true };
          }
          set({ isLoading: false });
          return { success: false, error: res.error || "Authentication failed" };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Google Login error";
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      loginWithMockUser: async (mockData) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post<User>("/auth/google", {
            mockUser: mockData || {
              googleId: "mock-google-id-999",
              email: "alex.finance@example.com",
              name: "Alex Dev",
              avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
            },
          });
          if (res.success && res.data) {
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return { success: true };
          }
          set({ isLoading: false });
          return { success: false, error: res.error || "Mock authentication failed" };
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Mock Login error";
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      checkAuthSession: async () => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get<User>("/auth/me");
          if (res.success && res.data) {
            set({ user: res.data, isAuthenticated: true, isInitialized: true, isLoading: false });
          } else {
            // Try refresh token once
            const refreshRes = await apiClient.post<User>("/auth/refresh", {});
            if (refreshRes.success && refreshRes.data) {
              set({
                user: refreshRes.data,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
              });
            } else {
              set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
            }
          }
        } catch {
          set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.post("/auth/logout", {});
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "my-finance-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
