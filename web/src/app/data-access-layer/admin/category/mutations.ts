import { graphql } from "@/graphql";

export const NewCategoryMutation = graphql(`
  mutation NewCategoryMutation($parentCategoryId: String, $slug: String!) {
    createCategory(
      createCategoryInput: { parentCategoryId: $parentCategoryId, slug: $slug }
    ) {
      id
    }
  }
`);
