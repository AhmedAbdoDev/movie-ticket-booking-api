import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    email: z.email("A valid email address is required").trim().toLowerCase(),
    password: passwordSchema,
    role: z.enum(["CINEMA_ADMIN", "CUSTOMER"]).optional(),
  }),
});
   
export const loginSchema = z.object({
  body: z.object({
    email: z.email("A valid email address is required").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});
