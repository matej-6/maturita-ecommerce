import { graphql } from "@/graphql";

export const NewCategoryMutation = graphql(`
  mutation NewCategoryMutation(
    $parentCategoryId: Int
    $slug: String!
    $isPublic: Boolean!
  ) {
    createCategory(
      createCategoryInput: {
        parentCategoryId: $parentCategoryId
        slug: $slug
        isPublic: $isPublic
      }
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
    $isPublic: Boolean!
  ) {
    updateCategory(
      updateCategoryInput: {
        id: $id
        parentCategoryId: $parentCategoryId
        slug: $slug
        isPublic: $isPublic
      }
    ) {
      slug
      parentCategoryId
      isPublic
    }
  }
`);

export const DeleteCategoryMutation = graphql(`
  mutation DeleteCategoryMutation($id: Int!) {
    removeCategory(id: $id) {
      id
    }
  }
`);
