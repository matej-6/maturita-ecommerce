import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch(GraphQLError)
export class GlobalGraphqlFilter<T> implements ExceptionFilter {
  catch(exception: GraphQLError, host: ArgumentsHost) {}
}
