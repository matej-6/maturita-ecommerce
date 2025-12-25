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
    searchProductVariants(ascending: false, sortBy: "createdAt", pageSize: 6) {
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
            base64
            mimeType
          }
          product {
            slug
            name
            id
            description
            thumbnailImage {
              base64
              mimeType
            }
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
