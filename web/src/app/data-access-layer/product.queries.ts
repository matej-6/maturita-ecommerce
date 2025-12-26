"use server";

import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
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
        base64
        mimeType
        isThumbnail
      }
      variants {
        id
        sku
        stock
        priceInCents
        images {
          id
          base64
          mimeType
          isThumbnail
        }
        attributes {
          value
          translatedValue
          key {
            key
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
  slug: string
): Promise<ActionResponse<ExecutionResult<ProductPageQueryQuery>["data"]>> {
  const res = await execute(ProductPageDocument, { slug: slug });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function getProductIdBySlugAction(
  slug: string
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
