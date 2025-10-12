import { useTranslations } from "next-intl";
import z from "zod";

/**
 * Function that returns a new newCategoryTranslationSchema, with error messages translated to match user preference
 * @param t - next-intl on 'form'
 * @returns newCategoryTranslationSchema
 */
export const newCategoryTranslationSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z.object({
    name: z
      .string({
        error: t("required", { fieldName: "Name", sk_fieldName: "Meno" }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: "Name",
          sk_fieldName: "Meno",
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: "Name",
          sk_fieldName: "Meno",
          value: 255,
        }),
      }),
    description: z
      .string({
        error: t("required", {
          fieldName: "Description",
          sk_fieldName: "Popis",
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: "Description",
          sk_fieldName: "Popis",
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: "Description",
          sk_fieldName: "Popis",
          value: 255,
        }),
      }),
    localeCode: z
      .string({
        error: t("required", {
          fieldName: "Locale code",
          sk_fieldName: "Kód lokality",
        }),
      })
      .min(2, {
        error: t("minLength", {
          value: 3,
          fieldName: "Locale code",
          sk_fieldName: "Kód lokality",
        }),
      })
      .max(5, {
        error: t("minLength", {
          value: 3,
          fieldName: "Locale code",
          sk_fieldName: "Kód lokality",
        }),
      }),
  });

export type newCategoryTranslationSchemaType = z.infer<
  ReturnType<typeof newCategoryTranslationSchema>
>;
