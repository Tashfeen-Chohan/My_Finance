import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { VEHICLES_QUERY_KEY } from "./use-vehicles-query";

export const FUEL_QUERY_KEY = ["fuel-expenses"];

export function useFuelExpenses(vehicleId = null) {
  return useQuery({
    queryKey: vehicleId ? [...FUEL_QUERY_KEY, vehicleId] : FUEL_QUERY_KEY,
    queryFn: async () => {
      const endpoint = vehicleId ? `/fuel-expenses/vehicle/${vehicleId}` : "/fuel-expenses";
      const res = await apiClient.get(endpoint);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch fuel expenses");
      }
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddFuelExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        odometer: Number(data.odometer || 0),
        quantity: Number(data.quantity || 0),
        unitPrice: Number(data.unitPrice || 0),
        totalCost: Number(data.totalCost || (Number(data.quantity) * Number(data.unitPrice)).toFixed(2)),
        date: data.date || new Date().toISOString(),
        isFullTank: Boolean(data.isFullTank),
      };

      const res = await apiClient.post("/fuel-expenses", payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to log fuel expense");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useUpdateFuelExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = {
        ...data,
        odometer: data.odometer !== undefined ? Number(data.odometer) : undefined,
        quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
        unitPrice: data.unitPrice !== undefined ? Number(data.unitPrice) : undefined,
        totalCost:
          data.totalCost !== undefined
            ? Number(data.totalCost)
            : data.quantity && data.unitPrice
            ? Number((Number(data.quantity) * Number(data.unitPrice)).toFixed(2))
            : undefined,
      };

      const res = await apiClient.put(`/fuel-expenses/${id}`, payload);
      if (!res.success) {
        throw new Error(res.error || "Failed to update fuel expense");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

export function useDeleteFuelExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/fuel-expenses/${id}`);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete fuel expense");
      }
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUEL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}
