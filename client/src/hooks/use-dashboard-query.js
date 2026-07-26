import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export const DASHBOARD_QUERY_KEY = ["dashboard-summary"];

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/summary");
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch dashboard summary");
      }
      return res.data?.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
