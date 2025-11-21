import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productTranslationFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>,
  locales: string[]
) =>
  z.object({
    name: z
      .string({
        error: t("required", {
          fieldName: c("productTranslation.title"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("productTranslation.title"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("productTranslation.title"),
          value: 255,
        }),
      }),
    description: z
      .string()
      .max(4000, {
        error: t("maxLength", {
          fieldName: c("productTranslation.description"),
          value: 4000,
        }),
      })
      .optional(),
    markdownContent: z.string().optional(),
    locale:
      locales.length > 0 ? z.literal(locales) : z.never({ error: t("never") }),
  });

export type productTranslationFormSchemaType = z.infer<
  ReturnType<typeof productTranslationFormSchema>
>;
