"use server";

import { graphql } from "@/graphql";
import { fetchGraphql } from "../../fetch-graphql";

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
  }
`);

const newCategoryQueryDocument = graphql(`
  query newCategory_QueryDocument {
    ...AllCategories_QueryFragment
    ...Locales_QueryFragment
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
    ...AllCategories_QueryFragment
  }
`);

export async function getDataForNewCategory() {
  return await fetchGraphql(newCategoryQueryDocument);
}

export async function getEditCategoryQueryDocumentData(
  id: number,
  productCursor: number | null,
  productPageSize: number | null
) {
  return await fetchGraphql(editCategoryQueryDocument, {
    id: id,
    productCursor: productCursor,
    productPageSize: productPageSize,
  });
}
