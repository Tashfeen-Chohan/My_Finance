import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { VEHICLES_QUERY_KEY } from "./use-vehicles-query";

export const MAINTENANCE_QUERY_KEY = ["maintenance-expenses"];
export const UPCOMING_MAINTENANCE_KEY = ["maintenance-expenses", "upcoming"];

export function useMaintenanceLogs(vehicleId = null) {
  return useQuery({
    queryKey: vehicleId ? [...MAINTENANCE_QUERY_KEY, vehicleId] : MAINTENANCE_QUERY_KEY,
    queryFn: async () => {
      const endpoint = vehicleId ? `/maintenance/vehicle/${vehicleId}` : "/maintenance";
      const res = await apiClient.get(endpoint);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch maintenance logs");
      }
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingServices() {
  return useQuery({
    queryKey: UPCOMING_MAINTENANCE_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/maintenance/upcoming");
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch upcoming service reminders");
      }
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const partsCost = Number(data.partsCost || 0);
      const laborCost = Number(data.laborCost || 0);
      const totalCost = Number(data.totalCost || (partsCost + laborCost).toFixed(2));

      const payload = {
        ...data,
        odometer: Number(data.odometer || 0),
        partsCost,
        laborCost,
        totalCost,
        date: data.date || new Date().toISOString(),
        nextServiceOdometer: data.nextServiceOdometer ? Number(data.nextServiceOdometer) : undefined,
        nextServiceDate: data.nextServiceDate || undefined,
      };

      const res = await apiClient.post("/maintenance", payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to record maintenance expense");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_MAINTENANCE_KEY });
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const partsCost = data.partsCost !== undefined ? Number(data.partsCost) : undefined;
      const laborCost = data.laborCost !== undefined ? Number(data.laborCost) : undefined;
      const totalCost =
        data.totalCost !== undefined
          ? Number(data.totalCost)
          : partsCost !== undefined && laborCost !== undefined
          ? Number((partsCost + laborCost).toFixed(2))
          : undefined;

      const payload = {
        ...data,
        odometer: data.odometer !== undefined ? Number(data.odometer) : undefined,
        partsCost,
        laborCost,
        totalCost,
        nextServiceOdometer: data.nextServiceOdometer ? Number(data.nextServiceOdometer) : undefined,
        nextServiceDate: data.nextServiceDate || undefined,
      };

      const res = await apiClient.put(`/maintenance/${id}`, payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to update maintenance record");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_MAINTENANCE_KEY });
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/maintenance/${id}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete maintenance record");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAINTENANCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UPCOMING_MAINTENANCE_KEY });
    },
  });
}
