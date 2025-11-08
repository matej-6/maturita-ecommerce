"use server";

import { graphql } from "@/graphql";
import { fetchGraphql } from "../../fetch-graphql";

const newCategoryQueryDocument = graphql(`
  query newCategory_QueryDocument {
    ...AllCategories_QueryFragment
    ...Locales_QueryFragment
  }
`);

const editCategoryQueryDocument = graphql(`
  query editCategory_QueryDocument($id: ID!) {
    category(id: $id) {
      slug
      name
      parentCategoryId
      isSetup
      isPublic
      translations(filtersInput: { locales: [] }) {
        locale
        name
        description
      }
      subcategories {
        slug
        id
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

export async function getEditCategoryQueryDocumentData(id: string) {
  return await fetchGraphql(editCategoryQueryDocument, { id: id });
}
