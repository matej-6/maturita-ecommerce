import { HttpException, HttpStatus } from '@nestjs/common';

type ValidationErrorType = {
  property: string;
  constraints: string[];
};

export class ValidationException extends HttpException {
  private readonly _errors: ValidationErrorType[];

  constructor(errors: ValidationErrorType[]) {
    super('Bad Request', HttpStatus.BAD_REQUEST);
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}
