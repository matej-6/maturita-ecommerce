import { graphql } from "@/graphql";
import "server-only";

export const CategoryQueryDocument = graphql(`
  query CategoryQuery(
    $slug: String!
    $productsCursor: Int
    $productsPageSize: Int
    $attributeFilters: [[String!]!]
  ) {
    category(slug: $slug, isSetup: true, isPublic: true) {
      id
      name
      slug
      description
      subcategories {
        slug
        name
        description
        isPublic
        isSetup
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
                url
              }
              name
              description
            }
            id
            sku
            thumbnailImage {
              url
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
