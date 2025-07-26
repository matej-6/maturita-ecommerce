import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

export type GraphQlContext = GraphQLExecutionContext & {
  req: Request;
  res: Response;
};
