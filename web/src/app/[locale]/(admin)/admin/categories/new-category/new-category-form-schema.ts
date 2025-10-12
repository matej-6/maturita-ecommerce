import z from "zod";
import { newCategoryTranslationSchema } from "./new-category-translation-schema";
import { useTranslations } from "next-intl";

/**
 * Function that returns a new newCategoryFormSchema, with error messages translated to match user preference
 * @param t - next-intl on 'form'
 * @returns newCategoryFormSchema
 */
export const newCategoryFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    slug: z
      .string({
        error: t("required", { fieldName: "Slug", sk_fieldName: "Slug" }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: "Slug",
          sk_fieldName: "Slug",
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: "Slug",
          sk_fieldName: "Slug",
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
