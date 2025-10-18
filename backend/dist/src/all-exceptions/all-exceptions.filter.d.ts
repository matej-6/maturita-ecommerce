import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exc: HttpException | GraphQLError, host: ArgumentsHost): GraphQLError | undefined;
}
