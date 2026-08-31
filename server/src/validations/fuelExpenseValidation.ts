import { z } from "zod";

export const createFuelExpenseSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    date: z.string().or(z.date()).default(() => new Date()),
    odometer: z.number().min(0, "Odometer reading cannot be negative"),
    distanceTraveled: z.number().min(0).optional(),
    quantity: z.number().gt(0, "Fuel quantity must be greater than zero"),
    unitPrice: z.number().min(0, "Unit price cannot be negative"),
    totalCost: z.number().min(0).optional(),
    isFullTank: z.boolean().default(true),
    computedEconomy: z.number().min(0).optional(),
    costPerKM: z.number().min(0).optional(),
    dailyDistanceDriven: z.number().min(0).optional(),
    isLocked: z.boolean().optional(),
    stationName: z.string().max(100).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const updateFuelExpenseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Fuel expense ID parameter is required"),
  }),
  body: z.object({
    date: z.string().or(z.date()).optional(),
    odometer: z.number().min(0).optional(),
    distanceTraveled: z.number().min(0).optional(),
    quantity: z.number().gt(0).optional(),
    unitPrice: z.number().min(0).optional(),
    totalCost: z.number().min(0).optional(),
    isFullTank: z.boolean().optional(),
    computedEconomy: z.number().min(0).optional(),
    costPerKM: z.number().min(0).optional(),
    dailyDistanceDriven: z.number().min(0).optional(),
    isLocked: z.boolean().optional(),
    stationName: z.string().max(100).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export const expenseIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Expense ID parameter is required"),
  }),
});
