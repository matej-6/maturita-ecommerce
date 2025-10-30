import { useTranslations } from "next-intl";
import z from "zod";

export const createLoginSchema = (
  t: ReturnType<typeof useTranslations<"form">>
) =>
  z.object({
    email: z.email({ error: t("invalidEmail") }),
    password: z.string({ error: t("required", { fieldName: "Password" }) }),
  });

export type loginSchemaType = z.infer<ReturnType<typeof createLoginSchema>>;
