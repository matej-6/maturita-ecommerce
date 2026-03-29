"use server";

import "server-only";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { OrderDetailsPageQueryQuery } from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { ActionResponse } from "../formActionResponse";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";

const OrderDetailsPageDocument = graphql(`
  query OrderDetailsPageQuery($id: Int!) {
    order(id: $id) {
      id
      status
      totalInCents
      createdAt
      updatedAt
      shippingDetails {
        line1
        line2
        state
        postalCode
        country
        city
        phone
      }
      items {
        id
        sku
        unitPriceInCents
        quantity
        productVariant {
          id
          sku
          thumbnailImage {
            url
          }
          product {
            slug
            thumbnailImage {
              url
            }
          }
        }
        productReview {
          id
          comment
          rating
          lang
        }
      }
    }
    locales {
      code
      name
      flag
    }
  }
`);

export async function getOrderDetailsPageData(
  id: number,
): Promise<
  ActionResponse<ExecutionResult<OrderDetailsPageQueryQuery>["data"]>
> {
  const res = await execute(OrderDetailsPageDocument, { id });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
