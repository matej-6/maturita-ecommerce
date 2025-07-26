import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ZodError } from 'zod';
export declare class ZodFilter<T extends ZodError> implements ExceptionFilter, GqlExceptionFilter {
    catch(exception: T, host: ArgumentsHost): void;
}
