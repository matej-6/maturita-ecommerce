import { UnauthorizedException as NestjsUnauhorizedException } from '@nestjs/common';
import { ERROR } from 'src/errors';

export class UnauthorizedException extends NestjsUnauhorizedException {
  constructor() {
    super(ERROR.unauthorizedException);
  }
}
