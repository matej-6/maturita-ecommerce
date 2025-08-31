import { StatusCodes } from "http-status-codes";

export class JsonErrorResponse {
  error: string = "";
  message: unknown[] | string = "An unknown error occurred";
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  static fromError(error: unknown): JsonErrorResponse {
    const res = new JsonErrorResponse();
    if (error instanceof Object) {
      if ("error" in error) {
        res.error = error.error as string;
      }
      if ("message" in error) {
        res.message = error.message as unknown[] | string;
      }
      if ("statusCode" in error) {
        res.statusCode = error.statusCode as number;
      }
    }
    return res;
  }

  getFieldValidationErrors(): Map<string, string[]> {
    const fieldErrors: Map<string, string[]> = new Map();
    if (!Array.isArray(this.message)) {
      return fieldErrors;
    }
    this.message.forEach((message) => {
      if (
        message instanceof Object &&
        "property" in message &&
        "constraints" in message
      ) {
        const property = message.property as string;
        const constraints = message.constraints as Record<string, string>;
        for (const constraint of Object.values(constraints)) {
          if (!fieldErrors.has(property)) {
            fieldErrors.set(property, []);
          }
          fieldErrors.get(property)?.push(constraint);
        }
      }
    });
    return fieldErrors;
  }

  getMessages(): string[] {
    if (!Array.isArray(this.message)) {
      return [this.message];
    }
    return this.message.filter((message) => typeof message === "string");
  }
}
