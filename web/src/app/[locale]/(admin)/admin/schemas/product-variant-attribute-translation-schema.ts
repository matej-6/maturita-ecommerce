import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productVariantAttributeTranslationFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>,
  locales: string[]
) =>
  z.object({
    valueTranslation: z
      .string({
        error: t("required", {
          fieldName: c("productVariant.attribute.valueTranslation"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("productVariant.attribute.valueTranslation"),
          value: 1,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("productVariant.attribute.valueTranslation"),
          value: 255,
        }),
      }),
    locale:
      locales.length > 0 ? z.literal(locales) : z.never({ error: t("never") }),
  });

export type productVariantAttributeTranslationFormSchemaType = z.infer<
  ReturnType<typeof productVariantAttributeTranslationFormSchema>
>;
