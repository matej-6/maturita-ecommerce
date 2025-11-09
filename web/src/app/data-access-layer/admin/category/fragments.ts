import { graphql } from "@/graphql";

export const AllCategories_QueryFragment = graphql(`
  fragment AllCategories_QueryFragment on Query {
    categories(filtersInput: { parentCategoryId: "*" }) {
      id
      slug
      parentCategoryId
    }
  }
`);
