import z from "zod";

const errorResponseSchema = z.object({
  statusCode: z.int({ error: "invalid status" }),
  message: z.string({ error: "message is empty" }),
  fieldErrors: z
    .record(z.string(), z.array(z.string(), { error: "invalid field errors" }))
    .optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const defaultErrorResponse: ErrorResponse = {
  statusCode: 500,
  message: "An unexpected error ocurred",
};

export function newErrorResponse(body: unknown): ErrorResponse | undefined {
  try {
    return errorResponseSchema.parse(body);
  } catch (e: unknown) {
    console.error(e);
    return undefined;
  }
}
