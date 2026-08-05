import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { useVehicleStore } from "@/stores/use-vehicle-store";

export const VEHICLES_QUERY_KEY = ["vehicles"];
export const DEFAULT_VEHICLE_QUERY_KEY = ["default-vehicle"];

export function useVehicles() {
  const setDefaultVehicle = useVehicleStore((state) => state.setDefaultVehicle);

  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get("/vehicles");
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch vehicles");
      }
      const vehiclesList = res.data?.data || [];
      const defaultV = vehiclesList.find((v) => v.isDefault) || vehiclesList[0] || null;
      if (defaultV) {
        setDefaultVehicle(defaultV);
      }
      return vehiclesList;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDefaultVehicle() {
  const defaultVehicle = useVehicleStore((state) => state.defaultVehicle);
  const defaultVehicleId = useVehicleStore((state) => state.defaultVehicleId);
  const fetchDefaultVehicle = useVehicleStore((state) => state.fetchDefaultVehicle);

  const query = useQuery({
    queryKey: DEFAULT_VEHICLE_QUERY_KEY,
    queryFn: async () => {
      return await fetchDefaultVehicle();
    },
    initialData: defaultVehicle,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    defaultVehicle: query.data || defaultVehicle,
    defaultVehicleId: (query.data?.id || query.data?._id) || defaultVehicleId,
  };
}

export function useAddVehicle() {
  const queryClient = useQueryClient();
  const setDefaultVehicle = useVehicleStore((state) => state.setDefaultVehicle);

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
    onSuccess: (newVehicle) => {
      if (newVehicle?.isDefault || !useVehicleStore.getState().defaultVehicle) {
        setDefaultVehicle(newVehicle);
      }
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_VEHICLE_QUERY_KEY });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const setDefaultVehicle = useVehicleStore((state) => state.setDefaultVehicle);
  const defaultVehicleId = useVehicleStore((state) => state.defaultVehicleId);

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
    onSuccess: (updatedVehicle) => {
      const updatedId = updatedVehicle?.id || updatedVehicle?._id;
      if (updatedVehicle?.isDefault || updatedId === defaultVehicleId) {
        setDefaultVehicle(updatedVehicle);
      }
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_VEHICLE_QUERY_KEY });
    },
  });
}

export function useSetDefaultVehicle() {
  const queryClient = useQueryClient();
  const setDefaultVehicle = useVehicleStore((state) => state.setDefaultVehicle);

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.put(`/vehicles/${id}`, { isDefault: true });
      if (!res.success) {
        throw new Error(res.error || "Failed to set default vehicle");
      }
      return res.data?.data;
    },
    onSuccess: (updatedVehicle) => {
      if (updatedVehicle) {
        setDefaultVehicle(updatedVehicle);
      }
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_VEHICLE_QUERY_KEY });
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
    onSuccess: (_, deletedId) => {
      const currentDefaultId = useVehicleStore.getState().defaultVehicleId;
      if (deletedId === currentDefaultId) {
        useVehicleStore.getState().setDefaultVehicle(null);
        useVehicleStore.getState().fetchDefaultVehicle();
      }
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEFAULT_VEHICLE_QUERY_KEY });
    },
  });
}

