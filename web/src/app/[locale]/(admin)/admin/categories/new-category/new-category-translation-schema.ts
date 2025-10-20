import { useTranslations } from "next-intl";
import z from "zod";

/**
 * Function that returns a new newCategoryTranslationSchema, with error messages translated to match user preference
 * @param t - next-intl on 'form'
 * @returns newCategoryTranslationSchema
 */
export const newCategoryTranslationSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    name: z
      .string({
        error: t("required", { fieldName: c("category.name") }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("category.name"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("category.name"),
          value: 255,
        }),
      }),
    description: z
      .string({
        error: t("required", {
          fieldName: c("category.description"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("category.description"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("category.description"),
          value: 255,
        }),
      }),
    localeCode: z
      .string({
        error: t("required", {
          fieldName: c("locale.code"),
        }),
      })
      .min(2, {
        error: t("minLength", {
          value: 3,
          fieldName: c("locale.code"),
        }),
      })
      .max(5, {
        error: t("minLength", {
          value: 3,
          fieldName: c("locale.code"),
        }),
      }),
  });

export type newCategoryTranslationSchemaType = z.infer<
  ReturnType<typeof newCategoryTranslationSchema>
>;
