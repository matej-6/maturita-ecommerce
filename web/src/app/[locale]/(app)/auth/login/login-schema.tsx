import z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "invalidEmail" }),
  password: z
    .string({ error: "invalidPassword" })
    .min(8, { error: "minLengthPassword" }),
});
