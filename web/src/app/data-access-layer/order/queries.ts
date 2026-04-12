import "server-only";
import { graphql } from "@/graphql";

export const OrderDetailsPageDocument = graphql(`
  query OrderDetailsPageQuery($id: Int!) {
    order(id: $id) {
      id
      status
      totalInCents
      createdAt
      updatedAt
      shippingDetails {
        line1
        line2
        state
        postalCode
        country
        city
        phone
      }
      items {
        id
        sku
        unitPriceInCents
        quantity
        productVariant {
          id
          sku
          thumbnailImage {
            url
          }
          product {
            slug
            thumbnailImage {
              url
            }
          }
        }
        productReview {
          id
          comment
          rating
          lang
        }
      }
    }
    locales {
      code
      name
      flag
    }
  }
`);
