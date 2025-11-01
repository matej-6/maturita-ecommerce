import "server-only";
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
      parentCategoryId
      translations(langs: []) {
        locale
        name
        description
      }
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
