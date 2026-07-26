import { z } from "zod";

export const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    preferences: z
      .object({
        currency: z.string().max(5).optional(),
        distanceUnit: z.enum(["km", "miles"]).optional(),
        fuelUnit: z.enum(["liters", "gallons"]).optional(),
        theme: z.enum(["light", "dark", "system"]).optional(),
      })
      .optional(),
  }),
});
