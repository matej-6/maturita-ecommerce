import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
export declare class ZodPipe implements PipeTransform {
    private readonly schema;
    constructor(schema: ZodType);
    transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown>;
}
export declare function zodPipeFn(schema: ZodType): ZodPipe;
