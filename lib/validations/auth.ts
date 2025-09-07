import { z } from "zod";

export const loginAuthSchema = z.object({
  email: z.string().email(),
});

export const userAuthSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export const newPropertySchema = z.object({
  nickname: z.string().min(1),
  streetAddress: z.string().min(1),
  streetAddress2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
});