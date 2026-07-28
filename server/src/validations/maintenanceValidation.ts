import { z } from "zod";

export const createMaintenanceSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    date: z.string().or(z.date()).default(() => new Date()),
    odometer: z.number().min(0, "Odometer reading cannot be negative"),
    category: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Service title is required").max(150),
    description: z.string().max(2000).optional(),
    cost: z.number().min(0, "Cost cannot be negative"),
    serviceProvider: z.string().max(100).optional(),
    nextServiceOdometer: z.number().min(0).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateMaintenanceSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Maintenance ID parameter is required"),
  }),
  body: z.object({
    date: z.string().or(z.date()).optional(),
    odometer: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    title: z.string().min(1).max(150).optional(),
    description: z.string().max(2000).optional(),
    cost: z.number().min(0).optional(),
    serviceProvider: z.string().max(100).optional(),
    nextServiceOdometer: z.number().min(0).optional(),
    notes: z.string().max(1000).optional(),
  }),
});
