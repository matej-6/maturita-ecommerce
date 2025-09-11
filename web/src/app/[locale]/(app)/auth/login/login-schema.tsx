import z from "zod";

export const createLoginSchema = (
  t: (arg: string, args?: Record<string, string | number | Date>) => string
) =>
  z.object({
    email: z.string().optional(),
    password: z.string(),
    // .min(8, { error: t("minLengthPassword", { minLength: 8 }) }),
  });
