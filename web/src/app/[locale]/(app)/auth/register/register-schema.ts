import { useTranslations } from "next-intl";
import { z } from "zod";

/**
 * Function that returns a new registerSchema, with error messages translated to match user preference
 * @param t - next-intl on 'form'
 * @returns registerSchema
 */
export const createRegisterSchema = (
  t: ReturnType<typeof useTranslations<"form">>
) =>
  z
    .object({
      firstName: z
        .string({ error: t("required", { fieldName: "First name" }) })
        .max(128, {
          error: t("maxLength", { fieldName: "First name", value: 128 }),
        }),
      lastName: z
        .string({ error: t("required", { fieldName: "Last name" }) })
        .max(128, {
          error: t("maxLength", { fieldName: "Last name", value: 128 }),
        }),
      email: z.email({ error: t("invalidEmail") }),
      password: z
        .string()
        .min(8, {
          error: t("minLength", { fieldName: "Password", value: 8 }),
        })
        .max(512, {
          error: t("maxLength", { fieldName: "Password", value: 512 }),
        }),
      confirmPassword: z.string({
        error: t("required", { fieldName: "Confirm Password" }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "invalid_value",
          message: t("passwordsMustMatch"),
          path: ["confirmPassword"],
          input: data.confirmPassword,
          values: [data.confirmPassword],
        });
      }
    });

export type registerSchemaType = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
