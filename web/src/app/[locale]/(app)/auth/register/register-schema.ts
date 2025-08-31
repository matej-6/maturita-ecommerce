import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(128, {
        message: "First name must be less than 128 characters long",
      }),
    lastName: z.string().min(1, { message: "Last name is required" }).max(128, {
      message: "Last name must be less than 128 characters long",
    }),
    email: z
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" })
      .max(256, { message: "Email must be less than 256 characters long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(512, { message: "Password must be less than 512 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(512, { message: "Password must be less than 512 characters long" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "invalid_value",
        message: "Passwords do not match",
        path: ["confirmPassword"],
        input: data.confirmPassword,
        values: [data.confirmPassword],
      });
    }
  });
