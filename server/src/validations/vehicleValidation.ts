import { z } from "zod";

export const createVehicleSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Vehicle name is required").max(100),
    make: z.string().min(1, "Vehicle make is required").max(50),
    model: z.string().min(1, "Vehicle model is required").max(50),
    year: z.number().min(1900).max(new Date().getFullYear() + 2).optional(),
    licensePlate: z.string().max(20).optional(),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "other"]).default("petrol"),
    mileageUnit: z.enum(["km", "miles"]).default("km"),
    isDefault: z.boolean().default(false),
    initialOdometer: z.number().min(0, "Initial odometer cannot be negative").default(0),
    currentOdometer: z.number().min(0, "Current odometer cannot be negative").default(0),
    photoUrl: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Vehicle ID parameter is required"),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    make: z.string().min(1).max(50).optional(),
    model: z.string().min(1).max(50).optional(),
    year: z.number().min(1900).max(new Date().getFullYear() + 2).optional(),
    licensePlate: z.string().max(20).optional(),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "other"]).optional(),
    mileageUnit: z.enum(["km", "miles"]).optional(),
    isDefault: z.boolean().optional(),
    currentOdometer: z.number().min(0).optional(),
    photoUrl: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const vehicleIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Vehicle ID parameter is required"),
  }),
});
