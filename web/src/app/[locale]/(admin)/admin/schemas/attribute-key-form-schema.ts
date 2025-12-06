import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productVariantAttributeKeyFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    key: z
      .string({
        error: t("required", {
          fieldName: c("productVariant.attribute.key"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("productVariant.attribute.key"),
          value: 1,
        }),
      })
      .max(100, {
        error: t("maxLength", {
          fieldName: c("productVariant.attribute.key"),
          value: 100,
        }),
      }),
  });

export type productVariantAttributeKeyFormSchemaType = z.infer<
  ReturnType<typeof productVariantAttributeKeyFormSchema>
>;
