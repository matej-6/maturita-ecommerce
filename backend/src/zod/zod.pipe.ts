import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: unknown, metadata: ArgumentMetadata) {
    await this.schema.parseAsync(value);
    return value;
  }
}

export function zodPipeFn(schema: ZodType) {
  return new ZodPipe(schema);
}
