export type ErrorResponse = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function newJsonException(exc: unknown): ErrorResponse | undefined {
  try {
    return exc as ErrorResponse;
  } catch (e: unknown) {
    console.error(e);
  }
}
