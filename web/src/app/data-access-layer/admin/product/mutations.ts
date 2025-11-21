import { graphql } from "@/graphql";
import "server-only";

export const CreateProductMutation = graphql(`
  mutation CreateProductMutation(
    $slug: String!
    $categoryId: Int
    $isPublic: Boolean!
  ) {
    createProduct(
      createProductInput: {
        slug: $slug
        categoryId: $categoryId
        isPublic: $isPublic
      }
    ) {
      id
    }
  }
`);

export const EditProductMutation = graphql(`
  mutation EditProductMutation(
    $id: Int!
    $slug: String!
    $categoryId: Int
    $isPublic: Boolean!
  ) {
    updateProduct(
      updateProductInput: {
        id: $id
        slug: $slug
        categoryId: $categoryId
        isPublic: $isPublic
      }
    ) {
      id
    }
  }
`);
