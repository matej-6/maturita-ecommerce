import { graphql } from "@/graphql";
import "server-only";
import { execute } from "@/graphql/execute";
import { ActionResponse } from "./formActionResponse";
import { ExecutionResult } from "graphql";
import { CategoryQueryQuery } from "@/graphql/graphql";

const HeaderQueryDocument = graphql(`
  query HeaderQuery {
    categories(parentCategoryId: null) {
      id
      name
      description
      slug
      subcategories {
        id
        slug
        name
      }
    }
  }
`);

export const getHeaderQueryData = async () => {
  return await execute(HeaderQueryDocument);
};

const CategoryQueryDocument = graphql(`
  query CategoryQuery(
    $slug: String!
    $productsCursor: Int
    $productsPageSize: Int
    $attributeFilters: [[String!]!]
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
        attributeFilters: $attributeFilters
      ) {
        nextCursor
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
            id
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
              key {
                key
                translatedKey
              }
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
  productsPageSize: number | null,
  attributes?: string[][],
): Promise<ActionResponse<ExecutionResult<CategoryQueryQuery>["data"]>> {
  const res = await execute(CategoryQueryDocument, {
    slug,
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
