import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GraphQLError } from 'graphql';
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exc: unknown, host: ArgumentsHost): GraphQLError | undefined;
}
