import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { DEFAULT_PREFERENCES } from "@/constants/preferences";

export const PREFERENCES_QUERY_KEY = ["user-preferences"];
export const LOCAL_STORAGE_PREFERENCES_KEY = "user_preferences";

export function getStoredPreferences() {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFERENCES_KEY);
    if (!item) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(item);
    return {
      fullTankDistance: Number(parsed.fullTankDistance) || DEFAULT_PREFERENCES.fullTankDistance,
      reserveDistance: Number(parsed.reserveDistance) || DEFAULT_PREFERENCES.reserveDistance,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setStoredPreferences(prefs) {
  if (typeof window === "undefined") return;
  try {
    const dataToSave = {
      fullTankDistance: Number(prefs.fullTankDistance) || DEFAULT_PREFERENCES.fullTankDistance,
      reserveDistance: Number(prefs.reserveDistance) || DEFAULT_PREFERENCES.reserveDistance,
    };
    localStorage.setItem(LOCAL_STORAGE_PREFERENCES_KEY, JSON.stringify(dataToSave));
  } catch {
    // ignore storage quota errors
  }
}

export function usePreferences() {
  return useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/preferences");
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch user preferences");
      }
      const data = res.data?.data || DEFAULT_PREFERENCES;
      setStoredPreferences(data);
      return data;
    },
    initialData: () => getStoredPreferences(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPrefs) => {
      const payload = {
        fullTankDistance: Number(newPrefs.fullTankDistance || DEFAULT_PREFERENCES.fullTankDistance),
        reserveDistance: Number(newPrefs.reserveDistance || DEFAULT_PREFERENCES.reserveDistance),
      };

      const res = await apiClient.put("/preferences", payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to update user preferences");
      }
      return res.data?.data;
    },
    onSuccess: (updatedData) => {
      if (updatedData) {
        setStoredPreferences(updatedData);
        queryClient.setQueryData(PREFERENCES_QUERY_KEY, updatedData);
        queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
      }
    },
  });
}
