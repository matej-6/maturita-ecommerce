import z from "zod";
import { useTranslations } from "next-intl";
import { productVariantFormSchema } from "@/app/[locale]/(admin)/admin/schemas/product-variant-schema";

/**
 * @param t - next-intl translations on 'form'
 * @param c - next-intl translations on 'fields'
 */
export const editAccountInformationSchema = (
  t: ReturnType<typeof useTranslations<"form">>,
  c: ReturnType<typeof useTranslations<"fields">>
) =>
  z.object({
    name: z
      .string({
        error: t("required", {
          fieldName: c("user.firstName"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("user.firstName"),
          value: 1,
        }),
      })
      .max(128, {
        error: t("maxLength", {
          fieldName: c("user.firstName"),
          value: 128,
        }),
      }),
    lastName: z
      .string({
        error: t("required", {
          fieldName: c("user.lastName"),
        }),
      })
      .min(1, {
        error: t("minLength", {
          fieldName: c("user.lastName"),
          value: 1,
        }),
      })
      .max(128, {
        error: t("maxLength", {
          fieldName: c("user.lastName"),
          value: 128,
        }),
      }),

    email: z
      .email({
        error: t("invalidEmail"),
      })
      .max(255, {
        error: t("maxLength", {
          fieldName: c("user.email"),
          value: 255,
        }),
      }),
  });

export type editAccountInformationSchemaType = z.infer<
  ReturnType<typeof editAccountInformationSchema>
>;
