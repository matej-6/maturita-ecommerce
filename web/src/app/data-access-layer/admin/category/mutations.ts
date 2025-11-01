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

export const EditCategoryMutation = graphql(`
  mutation EditCategoryMutation(
    $id: ID!
    $parentCategoryId: String
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
