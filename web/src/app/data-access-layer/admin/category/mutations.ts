import { graphql } from "@/graphql";

export const NewCategoryMutation = graphql(`
  mutation NewCategoryMutation($parentCategoryId: Int, $slug: String!) {
    createCategory(
      createCategoryInput: { parentCategoryId: $parentCategoryId, slug: $slug }
    ) {
      id
    }
  }
`);

export const EditCategoryMutation = graphql(`
  mutation EditCategoryMutation(
    $id: Int!
    $parentCategoryId: Int
    $slug: String!
  ) {
    updateCategory(
      updateCategoryInput: {
        id: $id
        parentCategoryId: $parentCategoryId
        slug: $slug
      }
    ) {
      slug
      parentCategoryId
    }
  }
`);
