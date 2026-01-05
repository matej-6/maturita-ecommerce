"use server";

import { graphql } from "@/graphql";
import { fetchGraphql } from "../../fetch-graphql";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import { EditCategory_QueryDocumentQuery } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";

const categoriesTableQueryDocument = graphql(`
  query categoriesTable_QueryDocument(
    $parentCategoryId: Int
    $pageSize: Int
    $cursor: Int
    $slug: String
    $id: Int
    $isSetup: Boolean
    $isPublic: Boolean
    $ascending: Boolean
    $sortBy: String
  ) {
    paginatedCategories(
      ascending: $ascending
      cursor: $cursor
      pageSize: $pageSize
      isPublic: $isPublic
      isSetup: $isSetup
      idQuery: $id
      slugQuery: $slug
      parentCategoryId: $parentCategoryId
      sortBy: $sortBy
    ) {
      edges {
        cursor
        node {
          id
          slug
          createdAt
          updatedAt
          isSetup
          isPublic
          name
          productsCount
          parentCategoryId
        }
      }
      hasNextPage
      totalCount
    }
    allCategories: categories(
      parentCategoryId: 0
      isPublic: null
      isSetup: null
    ) {
      id
      slug
      parentCategoryId
    }
  }
`);

const editCategoryQueryDocument = graphql(`
  query editCategory_QueryDocument(
    $id: Int!
    $productCursor: Int
    $productPageSize: Int
  ) {
    category(id: $id, isPublic: null, isSetup: null) {
      slug
      name
      parentCategoryId
      isSetup
      isPublic
      productsCount
      translations(locales: []) {
        id
        locale
        name
        description
      }
      subcategories {
        slug
        id
      }
    }
    products(
      categoryId: $id
      cursor: $productCursor
      pageSize: $productPageSize
      isPublic: null
      isSetup: null
    ) {
      hasNextPage
      edges {
        cursor
        node {
          id
          slug
          name
        }
      }
    }
    locales {
      code
      name
      flag
    }
    allCategories: categories(
      parentCategoryId: 0
      isPublic: null
      isSetup: null
    ) {
      id
      slug
      parentCategoryId
    }
  }
`);

export async function getEditCategoryQueryDocumentData(
  id: number,
  productCursor: number | null,
  productPageSize: number | null
): Promise<
  ActionResponse<ExecutionResult<EditCategory_QueryDocumentQuery>["data"]>
> {
  const res = await execute(editCategoryQueryDocument, {
    id: id,
    productCursor: productCursor,
    productPageSize: productPageSize,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return { success: true, data: res.data };
}
