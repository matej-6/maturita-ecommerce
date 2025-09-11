import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GraphQLError } from 'graphql';
export declare class GlobalGraphqlFilter<T> implements ExceptionFilter {
    catch(exception: GraphQLError, host: ArgumentsHost): void;
}
