import { graphql } from "@/graphql";

export const CartFragment = graphql(`
  fragment CartFragment on Cart {
    id
    items {
      id
      productVariant {
        sku
        priceInCents
        stock
        id
        thumbnailImage {
          url
        }
        attributes {
          key {
            key
            translatedKey
          }
          translatedValue
          value
        }
        product {
          name
          slug
          thumbnailImage {
            url
          }
        }
      }
      quantity
    }
  }
`);
