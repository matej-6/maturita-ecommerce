import z from "zod";
import { newCategoryTranslationSchema } from "./new-category-translation-schema";
import { useTranslations } from "next-intl";

/**
 * Function that returns a new newCategoryFormSchema, with error messages translated to match user preference
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'category'
 * @returns newCategoryFormSchema
 */
export const newCategoryFormSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"category">>
) =>
  z.object({
    slug: z
      .string({
        error: t("required", {
          fieldName: c("fields.slug"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("fields.slug"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("fields.slug"),
          value: 128,
        }),
      }),
    parentCategoryId: z.uuid({ error: t("uuid") }).optional(),
    translations: z.array(newCategoryTranslationSchema(t)).refine(
      (translations) => {
        return translations.some((t) => t.localeCode == "en");
      },
      {
        error: t("newCategoryFormSchema.translations.atLeastEnRequired"),
      }
    ),
  });

export type newCategoryFormShemaType = z.infer<
  ReturnType<typeof newCategoryFormSchema>
>;
