import z from "zod";
import { newCategoryTranslationSchema } from "./new-category-translation-schema";

export const newCategoryFormSchema = z.object({
  slug: z.string().min(3).max(255),
  parentCategoryId: z.uuid().optional(),
  translations: z.array(newCategoryTranslationSchema).refine(
    (translations) => {
      return translations.some((t) => t.localCode == "en");
    },
    {
      error: "English translation is required",
    },
  ),
});
