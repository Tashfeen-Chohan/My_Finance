import { z } from "zod";

export const fuelExpenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle selection is required"),
  date: z.string().min(1, "Date is required"),
  odometer: z.number().positive("Odometer reading must be positive"),
  liters: z.number().positive("Fuel volume must be positive"),
  pricePerLiter: z.number().positive("Price per liter must be positive"),
  fuelStation: z.string().optional(),
  notes: z.string().optional(),
});

