export default class FormError implements Error {
  name: string;
  message: string;
  stack?: string | undefined;
  cause?: unknown;
  fieldErrors: {
    property: string;
    constraints: string[];
  }[];
  constructor(
    message: string,
    fieldErrors: {
      property: string;
      constraints: string[];
    }[]
  ) {
    this.name = "FormError";
    this.message = message;
    this.fieldErrors = fieldErrors;
  }
}
