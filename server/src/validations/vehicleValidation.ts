import { z } from "zod";

export const createVehicleSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Vehicle name is required").max(100),
    make: z.string().min(1, "Vehicle make is required").max(50),
    model: z.string().min(1, "Vehicle model is required").max(50),
    year: z.number().min(1900).max(new Date().getFullYear() + 2).optional(),
    licensePlate: z.string().max(20).optional(),
    vin: z.string().max(30).optional(),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "other"]).default("petrol"),
    initialOdometer: z.number().min(0, "Initial odometer cannot be negative").default(0),
    currentOdometer: z.number().min(0, "Current odometer cannot be negative").default(0),
    currency: z.string().max(5).default("PKR"),
    isActive: z.boolean().default(true),
    photoUrl: z.string().optional(),
    notes: z.string().max(1000).optional(),
    clientSyncId: z.string().min(1, "Client sync ID is required"),
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
    vin: z.string().max(30).optional(),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "other"]).optional(),
    currentOdometer: z.number().min(0).optional(),
    currency: z.string().max(5).optional(),
    isActive: z.boolean().optional(),
    photoUrl: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const vehicleIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Vehicle ID parameter is required"),
  }),
});
