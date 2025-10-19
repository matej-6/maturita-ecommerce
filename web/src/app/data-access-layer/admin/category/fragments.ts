import { graphql } from "@/graphql";

export const AllCategories_QueryFragment = graphql(`
  fragment AllCategories_QueryFragment on Query {
    categories(parentId: null) {
      id
      slug
    }
  }
`);
