"use server";

import { graphql } from "@/graphql";
import "server-only";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  AdminOrderDetailPageQuery,
  AdminOrdersPage_QueryDocumentQuery,
  OrderStatus,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";

const AdminOrdersPageQueryDocument = graphql(`
  query AdminOrdersPage_QueryDocument(
    $cursor: Int
    $pageSize: Int!
    $sortBy: String
    $ascending: Boolean
    $status: OrderStatus
    $id: Int
    $userId: Int
    $minPrice: Int
    $maxPrice: Int
    $dateFrom: DateTime
    $dateTo: DateTime
  ) {
    findAllPaginatedOrders(
      cursor: $cursor
      pageSize: $pageSize
      sortBy: $sortBy
      ascending: $ascending
      status: $status
      id: $id
      userId: $userId
      minPrice: $minPrice
      maxPrice: $maxPrice
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      nextCursor
      edges {
        node {
          id
          totalInCents
          status
          createdAt
          updatedAt
          userId
        }
        cursor
      }
    }
  }
`);

export type PagingArgs = {
  cursor: number | null;
  nextCursor: number | null;
  pageSize: number;
};

export type SortingArgs = {
  ascending: boolean | null;
  sortBy: string | null;
};

export type TableArgs = {
  status: OrderStatus | null;
  id: number | null;
  userId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
};

export async function getAdminOrdersPageDataAction(
  pagingArgs: PagingArgs,
  sortingArgs: SortingArgs,
  tableArgs: TableArgs,
): Promise<
  ActionResponse<ExecutionResult<AdminOrdersPage_QueryDocumentQuery>["data"]>
> {
  const res = await execute(AdminOrdersPageQueryDocument, {
    cursor: pagingArgs.cursor,
    pageSize: pagingArgs.pageSize,
    sortBy: sortingArgs.sortBy,
    ascending: sortingArgs.ascending,
    status: tableArgs.status,
    id: tableArgs.id,
    userId: tableArgs.userId,
    minPrice: tableArgs.minPrice,
    maxPrice: tableArgs.maxPrice,
    dateFrom: tableArgs.dateFrom,
    dateTo: tableArgs.dateTo,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }
  return {
    success: true,
    data: res.data,
  };
}

const AdminOrderDetailPageQueryDocument = graphql(`
  query AdminOrderDetailPage($id: Int!) {
    findOrderById(id: $id) {
      id
      updatedAt
      createdAt
      status
      totalInCents
      shippingDetails {
        city
        country
        state
        line1
        line2
        postalCode
        phone
      }
      items {
        productVariantId
        sku
        unitPriceInCents
        quantity
        productVariant {
          id
          sku
          sku
          thumbnailImage {
            url
          }
          product {
            id
            slug
            thumbnailImage {
              url
            }
          }
        }
      }
    }
  }
`);

export async function getAdminOrderDetailPageDataAction(
  id: number,
): Promise<ActionResponse<ExecutionResult<AdminOrderDetailPageQuery>["data"]>> {
  const res = await execute(AdminOrderDetailPageQueryDocument, {
    id,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }
  return {
    success: true,
    data: res.data,
  };
}
