import "server-only";

import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  ProductDetailPage_QueryDocumentQuery,
  ProductsPage_QueryDocumentQuery,
} from "@/graphql/graphql";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { notFound } from "next/navigation";

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
    categories(isPublic: null, isSetup: null) {
      id
      slug
    }
    locales {
      flag
      code
      name
    }
    productVariantAttributeKeys(productId: null) {
      id
      key
      attributes {
        id
        value
        translations {
          value
          locale
        }
      }
    }
    product(id: $id, isPublic: null, isSetup: null) {
      id
      slug
      isPublic
      isSetup
      categoryId
      createdAt
      updatedAt
      translations {
        id
        locale
        name
        description
        markdownContent
      }
      images {
        id
        base64
        mimeType
        isThumbnail
      }
      variants(includeHidden: true) {
        id
        sku
        priceInCents
        isPublic
        stock
        attributes {
          id
          value
          key {
            id
            key
            translations {
              keyTranslation
            }
          }
          translations {
            value
          }
        }
        images {
          id
          base64
          mimeType
          isThumbnail
        }
      }
    }
  }
`);

export const ProductsPageQueryDocument = graphql(`
  query ProductsPage_QueryDocument(
    $cursor: Int
    $pageSize: Int!
    $sortBy: String
    $ascending: Boolean
    $slug: String
    $isSetup: Boolean
    $isPublic: Boolean
    $categoryId: Int
  ) {
    products(
      cursor: $cursor
      pageSize: $pageSize
      sortBy: $sortBy
      ascending: $ascending
      slug: $slug
      isSetup: $isSetup
      isPublic: $isPublic
      categoryId: $categoryId
    ) {
      hasNextPage
      edges {
        node {
          id
          slug
          isPublic
          isSetup
          categoryId
          createdAt
          updatedAt
        }
        cursor
      }
    }
  }
`);

export async function getProductDetailPageData(
  id: number
): Promise<
  ActionResponse<ExecutionResult<ProductDetailPage_QueryDocumentQuery>["data"]>
> {
  const res = await execute(ProductDetailPageQueryDocument, { id });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  if (!res.data) {
    return notFound();
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function getProductsPageData(
  pagingArgs: {
    cursor: number | null;
    pageSize: number;
  },
  sortingArgs: {
    ascending: boolean | null;
    sortBy: string | null;
  },
  tableArgs: {
    categoryId: number | null;
    slug: string | null;
    isSetup: true | false | null;
    isPublic: true | false | null;
  }
): Promise<
  ActionResponse<ExecutionResult<ProductsPage_QueryDocumentQuery>["data"]>
> {
  const res = await execute(ProductsPageQueryDocument, {
    cursor: pagingArgs.cursor,
    pageSize: pagingArgs.pageSize,
    sortBy: sortingArgs.sortBy || null,
    ascending: sortingArgs.ascending,
    slug: tableArgs.slug || null,
    isSetup: tableArgs.isSetup,
    isPublic: tableArgs.isPublic,
    categoryId: tableArgs.categoryId,
  });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data || null,
  };
}
