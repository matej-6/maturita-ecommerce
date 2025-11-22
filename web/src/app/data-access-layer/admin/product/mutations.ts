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

export const AddImageMutation = graphql(`
  mutation AddImageMutation(
    $productId: Int!
    $mimeType: String!
    $base64: String!
  ) {
    addProductImage(
      productId: $productId
      mimeType: $mimeType
      base64: $base64
    ) {
      id
    }
  }
`);

export const SetImageThumbnailMutation = graphql(`
  mutation SetImageThumbnailMutation($imageId: Int!) {
    setProductThumbnailImage(productImageId: $imageId) {
      id
    }
  }
`);

export const DeleteProductImageMutation = graphql(`
  mutation DeleteProductImageMutation($imageId: Int!) {
    deleteProductImage(productImageId: $imageId)
  }
`);
