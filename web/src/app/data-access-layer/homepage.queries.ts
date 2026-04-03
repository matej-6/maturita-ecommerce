"use server";

import { graphql } from "@/graphql";
import "server-only";
import { ActionResponse } from "./formActionResponse";
import { ExecutionResult } from "graphql";
import { HomepageQueryQuery } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "./admin/handleGraphqlFormError";

const HomepageQueryDocument = graphql(`
  query HomepageQuery {
    searchProductVariants(ascending: false, sortBy: "createdAt", pageSize: 10) {
      edges {
        node {
          id
          sku
          priceInCents
          attributes {
            value
            translatedValue
          }
          thumbnailImage {
            url
          }
          product {
            slug
            name
            id
            description
            thumbnailImage {
              url
            }
          }
        }
      }
    }
    bestSellingProductVariantsStatistic(
      limit: 10
      timePeriod: LAST_SEVEN_DAYS
    ) {
      productVariant {
        id
        sku
        priceInCents
        thumbnailImage {
          url
        }
        product {
          id
          slug
          name
          description
          thumbnailImage {
            url
          }
        }
        attributes {
          value
          translatedValue
          key {
            key
            translatedKey
          }
        }
      }
    }
    paginatedProductReviews(pageSize: 10, cursor: null) {
      edges {
        node {
          id
          rating
          comment
          createdAt
          author {
            firstName
            avatarUrl
            lastName
          }
          productVariant {
            sku
          }
        }
      }
    }
  }
`);

export async function getHomepageData(): Promise<
  ActionResponse<ExecutionResult<HomepageQueryQuery>["data"]>
> {
  const res = await execute(HomepageQueryDocument);
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
