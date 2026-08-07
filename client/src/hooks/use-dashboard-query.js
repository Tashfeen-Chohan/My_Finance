import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export const DASHBOARD_STATS_KEY = ["dashboard-stats"];
export const DASHBOARD_RECENT_ACTIVITY_KEY = ["dashboard-recent-activity"];
export const DASHBOARD_REMINDERS_KEY = ["dashboard-upcoming-reminders"];
export const DASHBOARD_MONTHLY_KEY = ["dashboard-monthly-comparison"];

export function useDashboardStats(vehicleId) {
  return useQuery({
    queryKey: [...DASHBOARD_STATS_KEY, vehicleId],
    queryFn: async () => {
      const res = await apiClient.get(`/dashboard/stats?vehicleId=${vehicleId}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch dashboard stats");
      }
      return res.data?.data;
    },
    enabled: Boolean(vehicleId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardRecentActivity(vehicleId) {
  return useQuery({
    queryKey: [...DASHBOARD_RECENT_ACTIVITY_KEY, vehicleId],
    queryFn: async () => {
      const res = await apiClient.get(`/dashboard/recent-activity?vehicleId=${vehicleId}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch recent activity");
      }
      return res.data?.data || [];
    },
    enabled: Boolean(vehicleId),
    staleTime: 1 * 60 * 1000,
  });
}

export function useDashboardUpcomingReminders(vehicleId) {
  return useQuery({
    queryKey: [...DASHBOARD_REMINDERS_KEY, vehicleId],
    queryFn: async () => {
      const res = await apiClient.get(`/dashboard/upcoming-reminders?vehicleId=${vehicleId}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch upcoming reminders");
      }
      return res.data?.data || [];
    },
    enabled: Boolean(vehicleId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardMonthlyComparison(vehicleId) {
  return useQuery({
    queryKey: [...DASHBOARD_MONTHLY_KEY, vehicleId],
    queryFn: async () => {
      const res = await apiClient.get(`/dashboard/monthly-comparison?vehicleId=${vehicleId}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch monthly comparison");
      }
      return res.data?.data || [];
    },
    enabled: Boolean(vehicleId),
    staleTime: 5 * 60 * 1000,
  });
}
