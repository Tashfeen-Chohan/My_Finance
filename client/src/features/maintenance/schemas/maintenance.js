import { z } from "zod";

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle selection is required"),
  date: z.string().min(1, "Date is required"),
  serviceType: z.string().min(1, "Service type is required"),
  cost: z.number().positive("Cost must be positive"),
  odometer: z.number().positive("Odometer reading must be positive"),
  serviceProvider: z.string().optional(),
  notes: z.string().optional(),
});

