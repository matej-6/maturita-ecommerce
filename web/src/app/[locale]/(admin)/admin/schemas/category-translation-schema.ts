import z from "zod";
import { useTranslations } from "next-intl";

/**
 * Function that returns a new categoryTranslationSchema, with error messages translated to match user preference
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 * @returns categoryTranslationSchema
 */
export const categoryTranslationSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    name: z
      .string({
        error: t("required", {
          fieldName: c("categoryTranslation.name"),
        }),
      })
      .min(3, {
        error: t("minLength", {
          fieldName: c("categoryTranslation.name"),
          value: 3,
        }),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("categoryTranslation.name"),
          value: 255,
        }),
      }),
    description: z
      .uuid({ error: t("uuid") })
      .or(z.string({ error: t("uuid") }).length(0, { error: t("uuid") })),
  });

export type categoryTranslationSchemaType = z.infer<
  ReturnType<typeof categoryTranslationSchema>
>;
