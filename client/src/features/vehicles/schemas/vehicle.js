import { z } from "zod";

export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  licensePlate: z.string().optional(),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
});

