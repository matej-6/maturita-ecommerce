import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productVariantAttributeKeyTranslationFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>,
  locales: string[]
) =>
  z.object({
    keyTranslation: z
      .string({
        error: t("required", {
          fieldName: c("productVariant.attribute.keyTranslation"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("productVariant.attribute.keyTranslation"),
          value: 1,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("productVariant.attribute.key"),
          value: 255,
        }),
      }),

    locale:
      locales.length > 0 ? z.literal(locales) : z.never({ error: t("never") }),
  });

export type productVariantAttributeKeyTranslationFormSchemaType = z.infer<
  ReturnType<typeof productVariantAttributeKeyTranslationFormSchema>
>;
