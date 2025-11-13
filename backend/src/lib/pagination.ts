import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

// docs/source: https://docs.nestjs.com/graphql/resolvers#generics

interface IEdgeType<T> {
  cursor: number;
  node: T;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  totalCount: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType implements IEdgeType<T> {
    @Field(() => Int)
    cursor: number;

    @Field(() => classRef)
    node: T;
  }
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasNextPage: boolean;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
