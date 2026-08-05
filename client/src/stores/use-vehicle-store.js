import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/services/api-client";

export const useVehicleStore = create(
  persist(
    (set, get) => ({
      defaultVehicle: null,
      defaultVehicleId: null,
      isLoading: false,

      setDefaultVehicle: (vehicle) => {
        if (!vehicle) {
          set({ defaultVehicle: null, defaultVehicleId: null });
          return;
        }
        const vehicleId = vehicle.id || vehicle._id || null;
        set({ defaultVehicle: vehicle, defaultVehicleId: vehicleId });
      },

      fetchDefaultVehicle: async () => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get("/vehicles/default");
          if (res.success && res.data) {
            const vehicle = res.data.data || res.data;
            const vehicleId = vehicle?.id || vehicle?._id || null;
            set({ defaultVehicle: vehicle, defaultVehicleId: vehicleId, isLoading: false });
            return vehicle;
          }
        } catch (error) {
          console.error("Failed to fetch default vehicle:", error);
        } finally {
          set({ isLoading: false });
        }
        return null;
      },
    }),
    {
      name: "my_finance_default_vehicle_storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
    }
  )
);
