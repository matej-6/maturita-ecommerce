"use server";

import { graphql } from "@/graphql";
import { execute, executeWithCache } from "@/graphql/execute";
import {
  PagedProductReviewsByIdQuery,
  ProductIdBySlugQuery,
  ProductPageQueryQuery,
} from "@/graphql/graphql";
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

const PagedProductReviewsByIdDocument = graphql(`
  query PagedProductReviewsById(
    $productId: Int!
    $cursor: Int
    $pageSize: Int!
  ) {
    paginatedProductReviewsByProductId(
      productId: $productId
      cursor: $cursor
      pageSize: $pageSize
    ) {
      nextCursor
      totalCount
      edges {
        cursor
        node {
          id
          rating
          comment
          createdAt
          lang
          author {
            avatarUrl
            firstName
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

export async function getPagedProductReviewsById(
  productId: number,
  cursor: number | null,
  pageSize: number,
): Promise<
  ActionResponse<ExecutionResult<PagedProductReviewsByIdQuery>["data"]>
> {
  const res = await execute(PagedProductReviewsByIdDocument, {
    productId: productId,
    cursor: cursor,
    pageSize: pageSize,
  });

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
