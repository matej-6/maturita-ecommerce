import { graphql } from "@/graphql";
import { AttributeKeySortingField } from "@/graphql/graphql";
import "server-only";

export type PagingArgs = {
  cursor: number | null;
  pageSize: number;
};

export type FilterArgs = {
  id: number | null;
  key: string | null;
};

export type SortingArgs = {
  ascending: boolean | null;
  sortBy: AttributeKeySortingField | null;
};

export const PagedAttributeKeysQueryDocument = graphql(`
  query PagedAttributeKeysQuery(
    $cursor: Int
    $pageSize: Int!
    $id: Int
    $key: String
    $ascending: Boolean
    $sortBy: AttributeKeySortingField
  ) {
    findAllPaginatedProductVariantAttributeKeys(
      cursor: $cursor
      pageSize: $pageSize
      ascending: $ascending
      sortBy: $sortBy
      id: $id
      key: $key
    ) {
      hasNextPage
      totalCount
      edges {
        cursor
        node {
          id
          key
          createdAt
          updatedAt
          attributes {
            id
          }
        }
      }
    }
  }
`);

export const AdminAttributeKeyDetailsPageQueryDocument = graphql(`
  query AdminAttributeKeyDetailsPageQuery($id: Int!) {
    productVariantAttributeKey(id: $id) {
      id
      key
      createdAt
      updatedAt
      attributes {
        id
        value
        productVariants {
          id
          sku
          productId
        }
        translations {
          id
          locale
          value
        }
      }
      translations {
        id
        keyTranslation
        locale
      }
    }
    locales {
      code
      name
      flag
    }
  }
`);
