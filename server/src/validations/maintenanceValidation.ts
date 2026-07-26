import { z } from "zod";

export const createMaintenanceSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    date: z.string().or(z.date()).default(() => new Date()),
    odometer: z.number().min(0, "Odometer reading cannot be negative"),
    category: z.enum(["service", "repair", "part_replacement", "tire", "oil_change", "washing", "inspection", "other"]),
    title: z.string().min(1, "Service title is required").max(150),
    description: z.string().max(2000).optional(),
    partsCost: z.number().min(0).default(0),
    laborCost: z.number().min(0).default(0),
    totalCost: z.number().min(0).optional(),
    currency: z.string().max(5).default("PKR"),
    serviceProvider: z.string().max(100).optional(),
    nextServiceOdometer: z.number().min(0).optional(),
    nextServiceDate: z.string().or(z.date()).optional(),
    notes: z.string().max(1000).optional(),
    receiptUrls: z.array(z.string()).optional(),
    parts: z
      .array(
        z.object({
          name: z.string().min(1),
          quantity: z.number().gt(0).default(1),
          unitCost: z.number().min(0).default(0),
          partNumber: z.string().optional(),
        })
      )
      .optional(),
    tags: z.array(z.string()).optional(),
    clientSyncId: z.string().min(1, "Client sync ID is required"),
  }),
});

export const updateMaintenanceSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Maintenance ID parameter is required"),
  }),
  body: z.object({
    date: z.string().or(z.date()).optional(),
    odometer: z.number().min(0).optional(),
    category: z.enum(["service", "repair", "part_replacement", "tire", "oil_change", "washing", "inspection", "other"]).optional(),
    title: z.string().min(1).max(150).optional(),
    description: z.string().max(2000).optional(),
    partsCost: z.number().min(0).optional(),
    laborCost: z.number().min(0).optional(),
    totalCost: z.number().min(0).optional(),
    serviceProvider: z.string().max(100).optional(),
    nextServiceOdometer: z.number().min(0).optional(),
    nextServiceDate: z.string().or(z.date()).optional(),
    notes: z.string().max(1000).optional(),
    tags: z.array(z.string()).optional(),
  }),
});
