import z from "zod";

const errorResponseSchema = z.object({
  status: z.int({ error: "invalid status" }),
  message: z.string({ error: "message is empty" }),
  fieldErrors: z
    .record(z.string(), z.array(z.string(), { error: "invalid field errors" }))
    .optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const defaultErrorResponse: ErrorResponse = {
  status: 500,
  message: "An unexpected error ocurred",
};

/**
 *
 * @param exc result body of a request to turn into an ErrorResponse
 * @returns ErrorResponse or undefined
 */
export function newErrorResponse(body: unknown): ErrorResponse | undefined {
  try {
    return errorResponseSchema.parse(body);
  } catch (e: unknown) {
    console.error(e);
    return undefined;
  }
}
