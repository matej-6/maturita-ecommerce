import z from "zod";
import { useTranslations } from "next-intl";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const productVariantFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    sku: z
      .string({
        error: t("required", {
          fieldName: c("productVariant.sku"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("productVariant.sku"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("productVariant.sku"),
          value: 255,
        }),
      }),
    priceInCents: z
      .int({
        error: t("required", {
          fieldName: c("productVariant.priceInCents"),
        }),
      })
      .positive({
        error: t("positive", {
          fieldName: c("productVariant.priceInCents"),
        }),
      }),
    isPublic: z.boolean().default(true),
    stock: z
      .int({
        error: t("required", {
          fieldName: c("productVariant.stock"),
        }),
      })
      .min(0, {
        error: t("min", {
          fieldName: c("productVariant.stock"),
          value: "0",
        }),
      }),
    attributes: z.array(z.int()).optional(),
  });

export type productVariantFormSchemaType = z.infer<
  ReturnType<typeof productVariantFormSchema>
>;
