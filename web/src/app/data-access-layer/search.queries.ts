"use server";
import "server-only";

import { graphql } from "@/graphql";
import "server-only";
import { execute } from "@/graphql/execute";
import { ActionResponse } from "./formActionResponse";
import { ExecutionResult } from "graphql";
import { SearchProductsQueryQuery } from "@/graphql/graphql";

const SearchQueryDocument = graphql(`
  query SearchProductsQuery(
    $searchTerm: String!
    $productsCursor: Int
    $productsPageSize: Int
    $attributeFilters: [[String!]!]
  ) {
    searchProductVariants(
      attributeFilters: $attributeFilters
      cursor: $productsCursor
      pageSize: $productsPageSize
      searchTerm: $searchTerm
    ) {
      hasNextPage
      totalCount
      edges {
        cursor
        node {
          id
          stock
          productId
          sku
          priceInCents
          thumbnailImage {
            base64
            mimeType
          }
          attributes {
            value
            translatedValue
          }
          product {
            slug
            name
            thumbnailImage {
              base64
              mimeType
            }
            description
          }
        }
      }
    }
    productVariantAttributes {
      key {
        id
        key
        translatedKey
      }
      translatedValue
      value
    }
  }
`);

export async function getSearchProductsQueryData(
  searchTerm: string,
  productsCursor: number | null,
  productsPageSize: number | null,
  attributes?: string[][]
): Promise<ActionResponse<ExecutionResult<SearchProductsQueryQuery>["data"]>> {
  const res = await execute(SearchQueryDocument, {
    searchTerm,
    productsCursor,
    productsPageSize,
    attributeFilters: attributes,
  });

  if (res.errors) {
    return {
      success: false,
      message: res.errors.map((e) => e.message).join(", "),
    };
  }

  return {
    success: true,
    data: res.data,
  };
}
