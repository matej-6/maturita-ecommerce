import "server-only";

import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import { ProductDetailPage_QueryDocumentQuery } from "@/graphql/graphql";
import { handleGraphqlError } from "../handleGraphqlFormError";

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
    product(id: $id, isPublic: null, isSetup: null) {
      id
      slug
      isPublic
      isSetup
      categoryId
      createdAt
      updatedAt
      translations {
        locale
        name
        description
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
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data,
  };
}
