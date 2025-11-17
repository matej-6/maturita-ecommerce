import z from "zod";
import { useTranslations } from "next-intl";

/**
 * Function that returns a new productFormSchema, with error messages translated to match user preference
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 * @returns productFormSchema
 */
export const productFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    slug: z
      .string({
        error: t("required", {
          fieldName: c("product.slug"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("product.slug"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("product.slug"),
          value: 255,
        }),
      }),
    categoryId: z.number({ error: t("id") }).nullable(),
    isPublic: z.boolean({
      error: t("required", { fieldName: c("product.isPublic") }),
    }),
  });

export type productFormSchemaType = z.infer<
  ReturnType<typeof productFormSchema>
>;
