import { graphql } from "@/graphql";

export const AllCategories_QueryFragment = graphql(`
  fragment AllCategories_QueryFragment on Query {
    categories(parentCategoryId: 0, isPublic: null, isSetup: null) {
      id
      slug
      parentCategoryId
    }
  }
`);
