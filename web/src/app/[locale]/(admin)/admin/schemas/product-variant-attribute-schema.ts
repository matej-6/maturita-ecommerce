import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productVariantAttributeFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    attributeKeyId: z.int({
      error: t("required", {
        fieldName: c("productVariant.attribute.key"),
      }),
    }),
    attributeValue: z
      .string({
        error: t("required", {
          fieldName: c("productVariant.attribute.value"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("productVariant.attribute.value"),
          value: 1,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("productVariant.attribute.value"),
          value: 255,
        }),
      }),
  });

export type productVariantAttributeFormSchemaType = z.infer<
  ReturnType<typeof productVariantAttributeFormSchema>
>;
