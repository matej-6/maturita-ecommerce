import z from "zod";

export class FieldValidationResult {
  fieldErrors: Map<string, string[]>;
  globalErrors: string[];

  constructor() {}

  static fromZodValidationError(zodErrors: z.ZodError) {}
}
