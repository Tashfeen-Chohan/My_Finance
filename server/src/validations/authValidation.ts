import { z } from "zod";

export const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string().optional(),
    mockUser: z
      .object({
        googleId: z.string().optional(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      })
      .optional(),
  }),
});
