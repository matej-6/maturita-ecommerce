import "server-only";
import { graphql } from "@/graphql";
import { fetchGraphql } from "../../fetch-graphql";

const newCategoryQueryDocument = graphql(`
  query newCategory_QueryDocument {
    ...AllCategories_QueryFragment
    ...Locales_QueryFragment
  }
`);

export async function getDataForNewCategory() {
  return await fetchGraphql(newCategoryQueryDocument);
}
