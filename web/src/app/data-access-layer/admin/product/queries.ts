import "server-only";

import { graphql } from "@/graphql";

export const NewProductPageQueryDocument = graphql(`
  query NewProductPage_QueryDocument {
    categories(isPublic: null, isSetup: null) {
      id
      slug
    }
  }
`);

export const ProductDetailPageQueryDocument = graphql(`
  query ProductDetailPage_QueryDocument($id: Int!) {
    product(id: $id, isPublic: null, isSetup: null) {
      id
      slug
      isPublic
      isSetup
      categoryId
      translations {
        locale
        name
        description
      }
      variants(includeHidden: true) {
        id
        sku
        priceInCents
        isPublic
      }
    }
  }
`);
