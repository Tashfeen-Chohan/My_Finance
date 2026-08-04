import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient, setStoredToken, setStoredRefreshToken, getStoredToken, getStoredRefreshToken } from "@/services/api-client";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      loginWithGoogleCredential: async (credential) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post("/auth/google", { credential });
          if (res.success && res.data) {
            if (res.data.accessToken) setStoredToken(res.data.accessToken);
            if (res.data.refreshToken) setStoredRefreshToken(res.data.refreshToken);
            const userObj = res.data.user || res.data;
            set({ user: userObj, isAuthenticated: true, isInitialized: true, isLoading: false });
            return { success: true };
          }
          set({ isLoading: false });
          return { success: false, error: res.error || "Authentication failed" };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Google Login error";
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      loginWithMockUser: async (mockData) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post("/auth/google", {
            mockUser: mockData || {
              googleId: "mock-google-id-999",
              email: "alex.finance@example.com",
              name: "Alex Dev",
              avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
            },
          });
          if (res.success && res.data) {
            if (res.data.accessToken) setStoredToken(res.data.accessToken);
            if (res.data.refreshToken) setStoredRefreshToken(res.data.refreshToken);
            const userObj = res.data.user || res.data;
            set({ user: userObj, isAuthenticated: true, isInitialized: true, isLoading: false });
            return { success: true };
          }
          set({ isLoading: false });
          return { success: false, error: res.error || "Mock authentication failed" };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Mock Login error";
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      checkAuthSession: async () => {
        const token = getStoredToken();
        const refresh = getStoredRefreshToken();

        // If no tokens exist at all, clear session immediately without calling server
        if (!token && !refresh) {
          set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
          return;
        }

        // Mark initialized so saved session renders immediately without blocking UI
        set({ isInitialized: true, isLoading: !get().isAuthenticated });

        try {
          const res = await apiClient.get("/auth/me");
          if (res.success && res.data) {
            const userObj = res.data.user || res.data;
            set({ user: userObj, isAuthenticated: true, isInitialized: true, isLoading: false });
          } else {
            // Try refresh token if access token failed
            const storedRefresh = getStoredRefreshToken();
            if (!storedRefresh) {
              setStoredToken(null);
              setStoredRefreshToken(null);
              set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
              return;
            }
            const refreshRes = await apiClient.post("/auth/refresh", { refreshToken: storedRefresh });
            if (refreshRes.success && refreshRes.data) {
              if (refreshRes.data.accessToken) setStoredToken(refreshRes.data.accessToken);
              if (refreshRes.data.refreshToken) setStoredRefreshToken(refreshRes.data.refreshToken);
              const userObj = refreshRes.data.user || refreshRes.data;
              set({
                user: userObj,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
              });
            } else {
              setStoredToken(null);
              setStoredRefreshToken(null);
              set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
            }
          }
        } catch {
          setStoredToken(null);
          setStoredRefreshToken(null);
          set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.post("/auth/logout", { refreshToken: getStoredRefreshToken() });
        } finally {
          setStoredToken(null);
          setStoredRefreshToken(null);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "my-finance-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);
