"use server";

import { graphql } from "@/graphql";
import { execute, executeWithCache } from "@/graphql/execute";
import { ProductIdBySlugQuery, ProductPageQueryQuery } from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import "server-only";
import { ActionResponse } from "./formActionResponse";
import { handleGraphqlError } from "./admin/handleGraphqlFormError";

const ProductPageDocument = graphql(`
  query ProductPageQuery($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
      markdownContent
      images {
        id
        url
        isThumbnail
      }
      variants {
        id
        sku
        stock
        priceInCents
        images {
          id
          url
          isThumbnail
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
  }
`);

const ProductIdBySlugDocument = graphql(`
  query ProductIdBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
    }
  }
`);

export async function getProductPageData(
  slug: string,
): Promise<ActionResponse<ExecutionResult<ProductPageQueryQuery>["data"]>> {
  const res = await executeWithCache(ProductPageDocument, { slug: slug });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function getProductIdBySlugAction(
  slug: string,
): Promise<ActionResponse<ExecutionResult<ProductIdBySlugQuery>["data"]>> {
  const res = await execute(ProductIdBySlugDocument, { slug: slug });
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
