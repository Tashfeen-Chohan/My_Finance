import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export const VEHICLES_QUERY_KEY = ["vehicles"];

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/vehicles");
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch vehicles");
      }
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        initialOdometer: Number(data.initialOdometer || 0),
        currentOdometer: Number(data.currentOdometer || data.initialOdometer || 0),
        year: data.year ? Number(data.year) : undefined,
      };

      const res = await apiClient.post("/vehicles", payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to add vehicle");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = {
        ...data,
        currentOdometer: data.currentOdometer !== undefined ? Number(data.currentOdometer) : undefined,
        year: data.year ? Number(data.year) : undefined,
      };

      const res = await apiClient.put(`/vehicles/${id}`, payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to update vehicle");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useSetDefaultVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.put(`/vehicles/${id}`, { isDefault: true });
      if (!res.success) {
        throw new Error(res.error || "Failed to set default vehicle");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/vehicles/${id}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete vehicle");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}
