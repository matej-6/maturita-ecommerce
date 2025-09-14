import z from "zod";

export const createLoginSchema = (
  t: (arg: string, args?: Record<string, string | number | Date>) => string
) =>
  z.object({
    email: z.email({ error: t("invalidEmail") }),
    password: z.string({ error: t("required", { fieldName: "Password" }) }),
  });

export type loginSchemaType = z.infer<ReturnType<typeof createLoginSchema>>;
