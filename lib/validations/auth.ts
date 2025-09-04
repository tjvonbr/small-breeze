import { z } from "zod";

export const loginAuthSchema = z.object({
  email: z.string().email(),
});

export const userAuthSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});