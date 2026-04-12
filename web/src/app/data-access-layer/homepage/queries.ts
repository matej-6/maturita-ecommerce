import { graphql } from "@/graphql";
import "server-only";
export const HomepageQueryDocument = graphql(`
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
