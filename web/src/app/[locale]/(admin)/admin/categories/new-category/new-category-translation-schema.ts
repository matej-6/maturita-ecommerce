import z from "zod";

export const newCategoryTranslationSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  localCode: z.string().min(2).max(5),
});
