import { graphql } from "@/graphql";
import "server-only";

export const ProductPageDocument = graphql(`
  query ProductPageQuery($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
      markdownContent
      isPublic
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
        isPublic
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

export const PagedProductReviewsByIdDocument = graphql(`
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
    locales {
      code
      flag
    }
  }
`);

export const ProductIdBySlugDocument = graphql(`
  query ProductIdBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
    }
  }
`);
export const SearchQueryDocument = graphql(`
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
      nextCursor
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
            url
          }
          attributes {
            value
            translatedValue
          }
          product {
            slug
            name
            thumbnailImage {
              url
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
