import { z } from "zod";

export const updatePreferenceSchema = z.object({
  body: z.object({
    fullTankDistance: z.number().min(1, "Full tank distance must be at least 1 km").optional(),
    reserveDistance: z.number().min(0, "Reserve distance cannot be negative").optional(),
  }),
});
