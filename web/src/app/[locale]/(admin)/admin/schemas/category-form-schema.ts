import z from "zod";
import { useTranslations } from "next-intl";

/**
 * Function that returns a new categoryFormSchema, with error messages translated to match user preference
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 * @returns newCategoryFormSchema
 */
export const categoryFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    slug: z
      .string({
        error: t("required", {
          fieldName: c("category.slug"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("category.slug"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("category.slug"),
          value: 128,
        }),
      }),
    parentCategoryId: z
      .uuid({ error: t("uuid") })
      .or(z.string({ error: t("uuid") }).length(0, { error: t("uuid") })),
  });

export type categoryFormSchemaType = z.infer<
  ReturnType<typeof categoryFormSchema>
>;
