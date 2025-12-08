import { graphql } from "@/graphql";
import { cache } from "react";
import "server-only";
import { fetchGraphql } from "./fetch-graphql";
import { execute } from "@/graphql/execute";
import { ActionResponse } from "./formActionResponse";
import { ExecutionResult } from "graphql";
import { CategoryQueryQuery } from "@/graphql/graphql";

const HeaderQueryDocument = graphql(`
  query HeaderQuery {
    ...HeaderNav_QueryFragment
  }
`);

export const getHeaderQueryData = cache(async () => {
  return await fetchGraphql(HeaderQueryDocument);
});

const CategoryQueryDocument = graphql(`
  query CategoryQuery(
    $slug: String!
    $productsCursor: Int
    $productsPageSize: Int
  ) {
    category(slug: $slug) {
      id
      name
      slug
      description
      subcategories {
        slug
        name
        description
      }
      categoryProductVariants(
        cursor: $productsCursor
        pageSize: $productsPageSize
        includeSubcategories: true
      ) {
        hasNextPage
        edges {
          cursor
          node {
            product {
              slug
              thumbnailImage {
                base64
                mimeType
              }
              name
              description
            }
            sku
            thumbnailImage {
              base64
              mimeType
            }
            priceInCents
            stock
            attributes {
              value
              translatedValue
            }
          }
        }
      }
      usedProductVariantAttributes {
        id
        value
        translatedValue
        key {
          key
          translatedKey
        }
      }
    }
  }
`);

export async function getCategoryQueryData(
  slug: string,
  productsCursor: number | null,
  productsPageSize: number | null
): Promise<ActionResponse<ExecutionResult<CategoryQueryQuery>["data"]>> {
  const res = await execute(CategoryQueryDocument, {
    slug,
    productsCursor,
    productsPageSize,
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
